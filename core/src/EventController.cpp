#include "EventController.hpp"
#include <X11/X.h>
#include <sys/types.h>
#include <unistd.h>
#include <xdo.h>

EventController::EventController() {
  instance = xdo_new(nullptr);
  delay = 10000;
}

void EventController::setGlobalDelay(int newDelay) { this->delay = newDelay; }

void EventController::enterText(std::string text) {
  Window window = CURRENTWINDOW;
  xdo_enter_text_window(instance, window, text.c_str(), delay);
}

void EventController::enterTextToWindow(std::string text, Window window) {
  xdo_enter_text_window(instance, window, text.c_str(), delay);
}

void EventController::moveMouse(int x, int y) {
  xdo_move_mouse(instance, x, y, 0);
}

void EventController::moveMouseRelative(int x, int y) {
  xdo_move_mouse_relative(instance, x, y);
}

void EventController::moveMouseRelativeToWindow(Window window, int x, int y) {
  xdo_move_mouse_relative_to_window(instance, window, x, y);
}

void EventController::mouseDown(Window window, int button) {
  xdo_mouse_down(instance, window, button);
}

void EventController::mouseUp(Window window, int button) {
  xdo_mouse_up(instance, window, button);
}

void EventController::activateWindow(Window window) {
  xdo_activate_window(instance, window);
  xdo_wait_for_window_active(instance, window, 1);
}

Window EventController::searchWindowByName(std::string name) {
  Window *list = NULL;
  uint entries;
  xdo_search_t query;
  memset(&query, 0, sizeof(xdo_search_t));
  query.max_depth = -1;
  query.require = xdo_search::SEARCH_ANY;
  auto namechr = name.c_str();
  query.searchmask = SEARCH_NAME;
  query.winname = namechr;
  // return CURRENTWINDOW;
  xdo_search_windows(instance, &query, &list, &entries);
  if (entries < 1) {
    std::cout
        << "Window not found. Defaulting to CURRENTWINDOW\n"; // TODO inaczej to
                                                              // trzeba
                                                              // rozwiazac,
                                                              // mozna zwrocic
                                                              // dwie wartosci,
                                                              // jedna z iloscia
                                                              // znalezionych, a
                                                              // druga z lista
    return CURRENTWINDOW;
  } else {
    return list[0];
  }
  // TODO wgl te listy trzeba skonwertowac na cos bezpieczniejszego i je
  // zwolnic, bo teraz jest memory leak
}

void EventController::keySequence(std::string sequence) {
  xdo_send_keysequence_window(instance, CURRENTWINDOW, sequence.c_str(), delay);
}

void EventController::attachController(sol::state &lua) {
  lua[luaNamespace] = this;
  sol::usertype<EventController> ec_type = lua.new_usertype<EventController>(
      "EventController", sol::constructors<EventController()>());
  // sol::usertype<Window> window_type = lua.new_usertype<Window>("Window");

  ec_type["getCurrentWindow"] = [] { return CURRENTWINDOW; };

  ec_type["enterText"] = &EventController::enterText;
  ec_type["enterTextToWindow"] = &EventController::enterTextToWindow;
  ec_type["keySequence"] = &EventController::keySequence;

  ec_type["searchWindowByName"] = &EventController::searchWindowByName;

  ec_type["activateWindow"] = &EventController::activateWindow;
  // MOUSE EVENTS
  ec_type["moveMouse"] = &EventController::moveMouse;
  ec_type["mouseDown"] = &EventController::mouseDown;
  ec_type["mouseUp"] = &EventController::mouseUp;
  ec_type["moveMouseRelative"] = &EventController::moveMouseRelative;
  ec_type["moveMouseRelativeToWindow"] =
      &EventController::moveMouseRelativeToWindow;

  //////
  ec_type["setGlobalDelay"] = &EventController::setGlobalDelay;
  lua["sleep"] = [](float seconds) { usleep(seconds * (1000000)); };
}
