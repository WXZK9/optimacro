#include "LuaMacroHandler.hpp"
#include "OptimacroDaemon.hpp"
#include <sol/sol.hpp>
#include <string>
#include <xdo.h>
using namespace std;

int main(int argc, char **argv) {
  LuaMacroHandler macro;
  if (argc != 2) {
    std::cout << "usage: ./optimacro [script_file]\n";
  } else {
    string arg = argv[1];
    if (arg == "--daemon") {
      runDaemon();
    } else
      macro.runFromFile(argv[1]);
  }
}
