#pragma once
#include "Controller.hpp"
#include "EventController.hpp"

/**
 * @brief Class for handling lua macros.
 *
 * This class provides functions for running lua macros.
 * It is also responsible for creating and attaching controllers for various
 * functionality.
 */
class LuaMacroHandler {
  sol::state lua;
  std::vector<Controller *>
      controllers; // TODO smartpointery/destruktor, bo beda
                   // leaki w uj jak tego nie zwolnimy, a sie samo nie zwolni
  void attachAllControllers();

public:
  LuaMacroHandler();
  /**
   * Runs lua macro from file.
   *
   * @param name Name of file to run.
   */
  void runFromFile(std::string name);
};
