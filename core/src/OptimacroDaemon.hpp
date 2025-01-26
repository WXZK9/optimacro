#ifndef OPTIMACRO_DAEMON_HPP
#define OPTIMACRO_DAEMON_HPP

#include <X11/Xlib.h>
#include <X11/extensions/XTest.h>
#include <X11/keysym.h>
#include <fstream>
#include <iostream>
#include <mutex>
#include <set>
#include <sstream>
#include <sys/stat.h>
#include <thread>
#include <unistd.h>
#include <vector>

using namespace std;

// Ścieżka do pliku z zapisanymi makrami
extern const string pathToFile;

// Struktura reprezentująca makro
struct Macro {
  string name;
  string shortcut;
  string filePath;
};

// Mutex dla współdzielenia danych o makrach
extern mutex macrosMutex;

// Zbiór zarejestrowanych skrótów
extern set<string> registeredShortcuts;

// Funkcja zwracająca czas modyfikacji pliku
time_t getFileModificationTime(const string &filePath);

// Funkcja ładująca makra z pliku JSON
vector<Macro> loadMacros(const string &jsonFilePath);

// Funkcja rejestrująca skróty klawiszowe
void registerKeys(Display *display, const vector<Macro> &macros);

// Funkcja wyrejestrowująca skróty klawiszowe
void unregisterKeys(Display *display, const vector<Macro> &previousMacros);

// Funkcja monitorująca zmiany w pliku JSON i przeładowująca makra
void monitorFileChanges(vector<Macro> &macros, const string &pathToFile,
                        Display *display);

// Funkcja nasłuchująca zdarzeń klawiszowych i uruchamiająca odpowiednie makra
void listenForKeyAndRunMacros(vector<Macro> &macros, Display *display);

int runDaemon();

#endif // OPTIMACRO_DAEMON_HPP
