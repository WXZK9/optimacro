#include <iostream>
#include <X11/Xlib.h>
#include <X11/keysym.h>
#include <X11/extensions/XTest.h>
#include <unistd.h>
#include <fstream>
#include <vector>
#include <sstream>

// WYMAGANE
// sudo pacman -S libx11 libxtst
// g++ OptimacroDaemon.cpp -lx11 -lxtst
// g++ OptimacroDaemon.cpp -L/usr/lib -lX11 -lXtst

using namespace std;

struct Macro {
    string name;
    string shortcut;
    string filePath;
};

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

void logKeyPress(const string& shortcut) {
    ofstream logFile("keylog.txt", ios::app);
    if (logFile.is_open()) {
        logFile << "Shortcut pressed: " << shortcut << endl;
        logFile.close();
    } else {
        cerr << "Error: Could not open log file." << endl;
    }
}

void listenForKeyAndRunMacros(const vector<Macro>& macros) {
    Display* display = XOpenDisplay(NULL); // Otwórz wyświetlacz X
    if (!display) {
        cerr << "Error: Cannot open display" << endl;
        return;
    }

    // Nasłuchuj na klawisze w całym systemie
    for (const auto& macro : macros) {
        string macroShortcut = macro.shortcut;

        // Rozdzielamy skrót na części (modifikatory + klawisz)
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

    // Główna pętla, aby monitorować zdarzenia
    while (true) {
        XEvent event;
        XNextEvent(display, &event);  // Czekaj na zdarzenie

        if (event.type == KeyPress) {
            KeySym keysym = XLookupKeysym(&event.xkey, 0);

            // Sprawdzamy modyfikatory
            bool ctrlPressed = event.xkey.state & ControlMask;
            bool altPressed = event.xkey.state & Mod1Mask;
            bool shiftPressed = event.xkey.state & ShiftMask;

            string pressedKey = string(1, keysym); // Klawisz

            cout << "Key pressed: " << pressedKey
                << " (Ctrl: " << ctrlPressed
                << ", Alt: " << altPressed
                << ", Shift: " << shiftPressed
                << ")" << endl;

            for (const auto& macro : macros) {
                // Sprawdzamy, czy skrót odpowiada naciśniętemu klawiszowi i modyfikatorowi
                bool matchFound = false;
                string macroShortcut = macro.shortcut;
                
                // Sprawdzenie czy skrót zawiera modyfikatory i klawisz
                if (pressedKey == macroShortcut.substr(macroShortcut.find_last_of("+") + 1)) {
                    if ((macroShortcut.find("ctrl") != string::npos && ctrlPressed) &&
                        (macroShortcut.find("alt") != string::npos && altPressed) &&
                        (macroShortcut.find("shift") != string::npos && shiftPressed)) {
                        matchFound = true;
                    } 
                    // Jeśli skrót nie zawiera modyfikatorów, sprawdzamy tylko klawisz
                    else if ((macroShortcut.find("ctrl") == string::npos || ctrlPressed) &&
                             (macroShortcut.find("alt") == string::npos || altPressed) &&
                             (macroShortcut.find("shift") == string::npos || shiftPressed)) {
                        matchFound = true;
                    }
                }

                if (matchFound) {
                    cout << "Executing script for shortcut " << macro.shortcut << ": " << macro.filePath << endl;
                    string execCommand = "../bin/optimacro " + macro.filePath;
                    system(execCommand.c_str());

                    // Logowanie naciśnięcia skrótu
                    logKeyPress(macro.shortcut);
                }
            }
        }

        usleep(10000); // Krótkie opóźnienie przed następnym zdarzeniem
    }

    XCloseDisplay(display); // Zamknij połączenie z wyświetlaczem
}

int main() {
    try {
        vector<Macro> macros = loadMacros("../../app/src/electron/MacroData/savedCodes.json");
        listenForKeyAndRunMacros(macros);
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }

    return 0;
}
