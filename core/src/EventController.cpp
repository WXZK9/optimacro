#include "EventController.hpp"
#include <X11/X.h>
#include <sys/types.h>
#include <unistd.h>
#include <xdo.h>

EventController::EventController() {
  instance = xdo_new(nullptr);
  defaultDelay = 10000;
}

void EventController::setGlobalDelay(int newDelay) {
  this->defaultDelay = newDelay;
}

// KEYBOARD EVENTS

void EventController::enterText(std::string text) {
  Window window = CURRENTWINDOW;
  xdo_enter_text_window(instance, window, text.c_str(), defaultDelay);
}

void EventController::enterTextAdvanced(std::string text, Window window,
                                        uint delay) {
  xdo_enter_text_window(instance, window, text.c_str(), delay);
}
void EventController::keySequence(std::string sequence) {
  xdo_send_keysequence_window(instance, CURRENTWINDOW, sequence.c_str(),
                              defaultDelay);
}

void EventController::keySequenceAdvanced(std::string sequence, Window window,
                                          uint delay) {
  xdo_send_keysequence_window(instance, window, sequence.c_str(), delay);
}

void EventController::keySequenceDown(std::string sequence) {
  xdo_send_keysequence_window_down(instance, CURRENTWINDOW, sequence.c_str(),
                                   defaultDelay);
}
void EventController::keySequenceUp(std::string sequence) {
  xdo_send_keysequence_window_up(instance, CURRENTWINDOW, sequence.c_str(),
                                 defaultDelay);
}
void EventController::keySequenceDownAdvanced(std::string sequence,
                                              Window window, uint delay) {
  xdo_send_keysequence_window_down(instance, window, sequence.c_str(), delay);
}
void EventController::keySequenceUpAdvanced(std::string sequence, Window window,
                                            uint delay) {
  xdo_send_keysequence_window_up(instance, window, sequence.c_str(), delay);
}
/////////////

// MOUSE EVENTS
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
std::tuple<int, int> EventController::getMouseLocation() {
  int x, y, screen;
  xdo_get_mouse_location(instance, &x, &y, &screen);
  return std::make_tuple(x, y);
}

void EventController::mouseClick(int button) {
  xdo_click_window(instance, CURRENTWINDOW, button);
}

void EventController::mouseClickWindow(Window window, int button) {
  xdo_click_window(instance, window, button);
}

Window EventController::getWindowUnderMouse() {
  Window result = CURRENTWINDOW;
  xdo_get_window_at_mouse(instance, &result);
  return result;
}

////////////////
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

void EventController::attachController(sol::state &lua) {
  lua[luaNamespace] = this;
  sol::usertype<EventController> ec_type = lua.new_usertype<EventController>(
      "EventController", sol::constructors<EventController()>());
  // sol::usertype<Window> window_type = lua.new_usertype<Window>("Window");

  ec_type["getCurrentWindow"] = [] { return CURRENTWINDOW; };
  ec_type["searchWindowByName"] = &EventController::searchWindowByName;
  ec_type["activateWindow"] = &EventController::activateWindow;

  // KEYBOARD EVENTS
  ec_type["enterText"] = &EventController::enterText;
  ec_type["enterTextAdvanced"] = &EventController::enterTextAdvanced;
  ec_type["keySequence"] = &EventController::keySequence;
  //////////////////////////
  // MOUSE EVENTS
  ec_type["moveMouse"] = &EventController::moveMouse;
  ec_type["mouseDown"] = &EventController::mouseDown;
  ec_type["mouseUp"] = &EventController::mouseUp;
  ec_type["moveMouseRelative"] = &EventController::moveMouseRelative;
  ec_type["moveMouseRelativeToWindow"] =
      &EventController::moveMouseRelativeToWindow;
  ec_type["getMouseLocation"] = &EventController::getMouseLocation;
  ec_type["mouseClick"] = &EventController::mouseClick;
  ec_type["mouseClickWindow"] = &EventController::mouseClickWindow;
  ec_type["getWindowUnderMouse"] = &EventController::getWindowUnderMouse;
  ////////////////////////
  ec_type["setGlobalDelay"] = &EventController::setGlobalDelay;
  lua["sleep"] = [](float seconds) { usleep(seconds * (1000000)); };
}
