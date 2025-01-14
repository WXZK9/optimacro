#pragma once

#include <sol/sol.hpp>
/**
 * @brief Base class for controllers.
 */
class Controller {
public:
  /**
   * Name of lua namespace to use. This will be used as the base class name in
   * lua scripts
   */
  std::string luaNamespace;
  /**
   * Method for attaching controller to lua state.
   *
   * @param lua Lua state to attach to.
   */
  virtual void attachController(sol::state &lua) {};
  virtual ~Controller(){};
};
