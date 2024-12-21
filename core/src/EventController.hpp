#pragma once
#include "Controller.hpp"
#include <X11/X.h>
#include <string>
#include <tuple>
#include <xdo.h>

struct UT_Window {
  Window v;
};
/**
 * @brief Class for handling X11 events
 *
 * This class provides functions for sending events to X11.
 * The class is exposed in lua as "event" namespace.
 * Bindings are defined in attachController method.
 */
class EventController : public Controller {
  xdo_t *instance;
  int defaultDelay;

public:
  std::string luaNamespace = "event";
  EventController();
  void attachController(sol::state &lua);
  void setGlobalDelay(int newDelay);
  Window searchWindowByName(std::string name);
  void activateWindow(Window window);
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
  /**
   * Get the window the mouse is currently over
   *
   * @return Selected window
   */
  Window getWindowUnderMouse();
  ///////////////////////////////
  // KEYBOARD EVENTS

  /**
   * Type a string to the current window.
   *
   * @param text The string to type, like "Hello world!"
   */

  void enterText(std::string text);
  /**
   * Type a string to the specified window with specified delay.
   *
   * @param text The string to type, like "Hello world!"
   * @param window The window you want to send keystrokes to or CURRENTWINDOW
   * @param delay The delay between keystrokes in microseconds
   */
  void enterTextAdvanced(std::string text, Window window, uint delay);
  /**
   * Send a keysequence to the current window.
   *
   * This allows you to send keysequences by symbol name. Any combination
   * of X11 KeySym names separated by '+' are valid. Single KeySym names
   * are valid, too.
   *
   * Examples:
   *   "l"
   *   "semicolon"
   *   "alt+Return"
   *   "Alt_L+Tab"
   *
   * @param sequence The string keysequence to send.
   */
  void keySequence(std::string sequence);
  ///////////
};
