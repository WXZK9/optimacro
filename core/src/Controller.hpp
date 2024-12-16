#pragma once

#include <sol/sol.hpp>
class Controller {
public:
  std::string luaNamespace;
  virtual void attachController(sol::state &lua) {};
  virtual ~Controller(){};
};
