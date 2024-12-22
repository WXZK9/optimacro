#include "LuaMacroHandler.hpp"
#include "EventController.hpp"

void LuaMacroHandler::attachAllControllers() {
  for (auto v : controllers)
    v->attachController(lua);
}
LuaMacroHandler::LuaMacroHandler() {
  lua.open_libraries(sol::lib::base);
  lua.open_libraries(sol::lib::os);
  controllers = {new EventController()};
  attachAllControllers();
}
void LuaMacroHandler::runFromFile(std::string name) { lua.script_file(name); }
