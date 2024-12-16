#pragma once
#include "Controller.hpp"
#include "EventController.hpp"
class LuaMacroHandler {
  sol::state lua;
  std::vector<Controller *>
      controllers; // TODO smartpointery/destruktor, bo beda
                   // leaki w uj jak tego nie zwolnimy, a sie samo nie zwolni
  void attachAllControllers();

public:
  LuaMacroHandler();
  void runFromFile(std::string name);
};
