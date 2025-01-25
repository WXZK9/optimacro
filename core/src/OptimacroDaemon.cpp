#include <iostream>
#include <X11/Xlib.h>
#include <X11/keysym.h>
#include <X11/extensions/XTest.h>
#include <unistd.h>
#include <fstream>
#include <vector>
#include <sstream>
#include <sys/stat.h> // Do sprawdzania czasu modyfikacji pliku
#include <thread>
#include <mutex>

using namespace std;

// WYMAGANE
// sudo pacman -S libx11 libxtst
// g++ OptimacroDaemon.cpp -lx11 -lxtst
// g++ OptimacroDaemon.cpp -L/usr/lib -lX11 -lXtst

const string pathToFile = "../../app/src/electron/MacroData/savedCodes.json";

struct Macro {
    string name;
    string shortcut;
    string filePath;
};

mutex macrosMutex; 

time_t getFileModificationTime(const string& filePath) {
    struct stat fileStat;
    if (stat(filePath.c_str(), &fileStat) == 0) {
        return fileStat.st_mtime;
    }
    throw runtime_error("Unable to get file modification time");
}

vector<Macro> loadMacros(const string& jsonFilePath) {
    ifstream file(jsonFilePath);
    if (!file.is_open()) {
        throw runtime_error("Could not open file");
    }

    string line, jsonContent;
    while (getline(file, line)) {
        jsonContent += line;
    }

    vector<Macro> macros;

    // Parsowanie ręczne JSON
    size_t pos = 0;
    while ((pos = jsonContent.find("{", pos)) != string::npos) {
        size_t namePos = jsonContent.find("\"name\": \"", pos);
        size_t shortcutPos = jsonContent.find("\"shortcut\": \"", pos);
        size_t filePathPos = jsonContent.find("\"filePath\": \"", pos);

        if (namePos != string::npos && shortcutPos != string::npos && filePathPos != string::npos) {
            Macro macro;
            macro.name = jsonContent.substr(namePos + 9, jsonContent.find("\"", namePos + 9) - (namePos + 9));
            macro.shortcut = jsonContent.substr(shortcutPos + 13, jsonContent.find("\"", shortcutPos + 13) - (shortcutPos + 13));
            macro.filePath = jsonContent.substr(filePathPos + 13, jsonContent.find("\"", filePathPos + 13) - (filePathPos + 13));

            macros.push_back(macro);
        }

        pos = jsonContent.find("}", pos) + 1;
    }

    return macros;
}

void registerKeys(Display* display, const vector<Macro>& macros) {
    for (const auto& macro : macros) {
        string macroShortcut = macro.shortcut;

        bool ctrlRequired = macroShortcut.find("ctrl") != string::npos;
        bool altRequired = macroShortcut.find("alt") != string::npos;
        bool shiftRequired = macroShortcut.find("shift") != string::npos;

        // Rejestrujemy odpowiednie kombinacje modyfikatorów
        if (ctrlRequired && altRequired && shiftRequired) {
            XGrabKey(display, XKeysymToKeycode(display, XStringToKeysym(macroShortcut.substr(macroShortcut.find_last_of("+") + 1).c_str())),
                     ControlMask | Mod1Mask | ShiftMask, DefaultRootWindow(display), True, GrabModeAsync, GrabModeAsync);
        } else if (ctrlRequired && altRequired) {
            XGrabKey(display, XKeysymToKeycode(display, XStringToKeysym(macroShortcut.substr(macroShortcut.find_last_of("+") + 1).c_str())),
                     ControlMask | Mod1Mask, DefaultRootWindow(display), True, GrabModeAsync, GrabModeAsync);
        } else if (ctrlRequired && shiftRequired) {
            XGrabKey(display, XKeysymToKeycode(display, XStringToKeysym(macroShortcut.substr(macroShortcut.find_last_of("+") + 1).c_str())),
                     ControlMask | ShiftMask, DefaultRootWindow(display), True, GrabModeAsync, GrabModeAsync);
        } else if (altRequired && shiftRequired) {
            XGrabKey(display, XKeysymToKeycode(display, XStringToKeysym(macroShortcut.substr(macroShortcut.find_last_of("+") + 1).c_str())),
                     Mod1Mask | ShiftMask, DefaultRootWindow(display), True, GrabModeAsync, GrabModeAsync);
        } else if (ctrlRequired) {
            XGrabKey(display, XKeysymToKeycode(display, XStringToKeysym(macroShortcut.substr(macroShortcut.find_last_of("+") + 1).c_str())),
                     ControlMask, DefaultRootWindow(display), True, GrabModeAsync, GrabModeAsync);
        } else if (altRequired) {
            XGrabKey(display, XKeysymToKeycode(display, XStringToKeysym(macroShortcut.substr(macroShortcut.find_last_of("+") + 1).c_str())),
                     Mod1Mask, DefaultRootWindow(display), True, GrabModeAsync, GrabModeAsync);
        } else if (shiftRequired) {
            XGrabKey(display, XKeysymToKeycode(display, XStringToKeysym(macroShortcut.substr(macroShortcut.find_last_of("+") + 1).c_str())),
                     ShiftMask, DefaultRootWindow(display), True, GrabModeAsync, GrabModeAsync);
        }
    }
}

void monitorFileChanges(vector<Macro> &macros, const string &pathToFile, Display* display) {
    time_t lastModificationTime = getFileModificationTime(pathToFile);

    while (true) {
        time_t currentModificationTime = getFileModificationTime(pathToFile);
        if (currentModificationTime != lastModificationTime) {
            cout << "File modified, reloading macros..." << endl;
            vector<Macro> newMacros = loadMacros(pathToFile);  // Ładowanie nowych makr

            // Aktualizacja makr w bezpieczny sposób z użyciem mutexa
            {
                lock_guard<mutex> guard(macrosMutex);
                macros = newMacros;
            }
            lastModificationTime = currentModificationTime;

            registerKeys(display, macros);

            for (const auto& macro : macros) {
                cout << "Loaded macro: " << macro.shortcut << " (" << macro.filePath << ")" << endl;
            }
        }

        usleep(500000);  // Przerwa 0,5 sekundy
    }
}

void logKeyPress(const string& shortcut) {
    ofstream logFile("keylog.txt", ios::app);
    if (logFile.is_open()) {
        logFile << "Shortcut pressed: " << shortcut << endl;
        logFile.close();
    } else {
        cerr << "Error: Could not open log file." << endl;
    }
}

void listenForKeyAndRunMacros(vector<Macro>& macros, Display* display) {
    // Główna pętla, aby monitorować zdarzenia
    while (true) {
        XEvent event;
        XNextEvent(display, &event);  // Czekaj na zdarzenie

        if (event.type == KeyPress) {
            KeySym keysym = XLookupKeysym(&event.xkey, 0);

            bool ctrlPressed = event.xkey.state & ControlMask;
            bool altPressed = event.xkey.state & Mod1Mask;
            bool shiftPressed = event.xkey.state & ShiftMask;

            string pressedKey(1, keysym); // Klawisz

            cout << "Key pressed: " << pressedKey
                 << " (Ctrl: " << ctrlPressed
                 << ", Alt: " << altPressed
                 << ", Shift: " << shiftPressed
                 << ")" << endl;

            for (const auto& macro : macros) {
                bool matchFound = false;
                string macroShortcut = macro.shortcut;

                if (pressedKey == macroShortcut.substr(macroShortcut.find_last_of("+") + 1)) {
                    if ((macroShortcut.find("ctrl") != string::npos && ctrlPressed) &&
                        (macroShortcut.find("alt") != string::npos && altPressed) &&
                        (macroShortcut.find("shift") != string::npos && shiftPressed)) {
                        matchFound = true;
                    } else if ((macroShortcut.find("ctrl") == string::npos || ctrlPressed) &&
                               (macroShortcut.find("alt") == string::npos || altPressed) &&
                               (macroShortcut.find("shift") == string::npos || shiftPressed)) {
                        matchFound = true;
                    }
                }

                if (matchFound) {
                    cout << "Executing script for shortcut " << macro.shortcut << ": " << macro.filePath << endl;
                    string execCommand = "../bin/optimacro " + macro.filePath;
                    system(execCommand.c_str());

                    logKeyPress(macro.shortcut);
                }
            }
        }

        usleep(100000); // Krótkie opóźnienie przed następnym zdarzeniem
    }
}

int main() {
    try {
        vector<Macro> macros = loadMacros(pathToFile);
        Display* display = XOpenDisplay(NULL);
        if (!display) {
            cerr << "Error: Cannot open display" << endl;
            return 1;
        }

        registerKeys(display, macros);

        thread fileMonitorThread(monitorFileChanges, ref(macros), pathToFile, display);
        listenForKeyAndRunMacros(macros, display);
        fileMonitorThread.join();
        XCloseDisplay(display);
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    
    return 0;
}
