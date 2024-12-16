#include "Controller.hpp"
#include "EventController.hpp"
#include "LuaMacroHandler.hpp"
#include <sol/sol.hpp>
#include <string>
#include <vector>
#include <xdo.h>
using namespace std;

int main(int argc, char **argv) {
  /*
  auto ec = EventController();
  sol::state lua;
  lua.open_libraries(sol::lib::base);
  lua["event"] = ec;
  sol::usertype<EventController> ec_type = lua.new_usertype<EventController>(
      "EventController", sol::constructors<EventController()>());
  ec_type["enterText"] = &EventController::enterText;
  ec_type["moveMouse"] = &EventController::moveMouse;
  lua.script_file("macro.lua");*/
  LuaMacroHandler macro;
  if (argc != 2) {
    std::cout << "usage: ./optimacro [script_file]\n";
  } else
    macro.runFromFile(argv[1]);
}
