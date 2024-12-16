#pragma once
#include "Controller.hpp"
#include <X11/X.h>
#include <string>
#include <xdo.h>

struct UT_Window {
  Window v;
};

class EventController : public Controller {
  xdo_t *instance;

public:
  std::string luaNamespace = "event";
  EventController();
  void attachController(sol::state &lua);
  void enterText(std::string text);
  void enterTextToWindow(std::string text, Window window);
  void moveMouse(int x, int y);
  Window searchWindowByName(std::string name);
  void activateWindow(Window window);
  void keySequence(std::string sequence);
};
