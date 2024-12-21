#pragma once
#include "Controller.hpp"
#include <X11/X.h>
#include <string>
#include <tuple>
#include <xdo.h>

struct UT_Window {
  Window v;
};

class EventController : public Controller {
  xdo_t *instance;
  int delay;

public:
  std::string luaNamespace = "event";
  EventController();
  void attachController(sol::state &lua);
  void enterText(std::string text);
  void setGlobalDelay(int newDelay);
  void enterTextToWindow(std::string text, Window window);
  // MOUSE EVENTS
  /**
   * Move the mouse to a specific location.
   *
   * @param x the target X coordinate on the screen in pixels.
   * @param y the target Y coordinate on the screen in pixels.
   */
  void moveMouse(int x, int y);
  /**
   * Move the mouse relative to it's current position.
   *
   * @param x the distance in pixels to move on the X axis.
   * @param y the distance in pixels to move on the Y axis.
   */
  void moveMouseRelative(int x, int y);
  /**
   * Move the mouse to a specific location relative to the top-left corner
   * of a window.
   *
   * @param window the target window.
   * @param x the target X coordinate on the screen in pixels.
   * @param y the target Y coordinate on the screen in pixels.
   */
  void moveMouseRelativeToWindow(Window window, int x, int y);
  /**
   * Send a mouse release (aka mouse up) for a given button at the current mouse
   * location.
   *
   * @param window The window you want to send the event to
   * @param button The mouse button. Generally, 1 is left, 2 is middle, 3 is
   *    right, 4 is wheel up, 5 is wheel down.
   */
  void mouseUp(Window window, int button);
  /**
   * Send a mouse press (aka mouse down) for a given button at the current mouse
   * location.
   *
   * @param window The window you want to send the event to
   * @param button The mouse button. Generally, 1 is left, 2 is middle, 3 is
   *    right, 4 is wheel up, 5 is wheel down.
   */
  void mouseDown(Window window, int button);
  /**
   * Get the current mouse location.
   *
   * @return A tuple of X and Y coordinates.
   */
  std::tuple<int, int> getMouseLocation();
  /**
   * Send a click for a specific mouse button at the current mouse location to
   * the current window.
   *
   * @param button The mouse button. Generally, 1 is left, 2 is middle, 3 is
   *    right, 4 is wheel up, 5 is wheel down.
   */
  void mouseClick(int button);
  /**
   * Send a click for a specific mouse button at the current mouse location to a
   * specific window.
   *
   * @param window The window you want to send the event
   * @param button The mouse button. Generally, 1 is left, 2 is middle, 3 is
   *    right, 4 is wheel up, 5 is wheel down.
   */
  void mouseClickWindow(Window window, int button);
  ///////////////////////////////
  Window searchWindowByName(std::string name);
  void activateWindow(Window window);
  void keySequence(std::string sequence);
};
