CPPFLAGS=-std=c++20 -Og -g -llua -lxdo -lX11
CC=g++

EXECUTABLE_NAME=optimacro
SOURCE_FILES= main.cpp EventController.cpp LuaMacroHandler.cpp OptimacroDaemon.cpp

SRC=src
BIN=bin
OBJ=$(BIN)/obj

EXECUTABLE_FILES = $(EXECUTABLE_NAME:%=$(BIN)/%)
OBJECT_FILES     = $(SOURCE_FILES:%.cpp=$(OBJ)/%.o)

run: build
	bin/optimacro

build: $(EXECUTABLE_FILES)

clean:
	rm -r -f $(BIN)

.PHONY: build clean

$(EXECUTABLE_FILES): $(OBJECT_FILES)
	@$(CC) -g -llua -lxdo -lX11 -o $@ $^
	@echo "Build successful!"
$(OBJECT_FILES): $(OBJ)/%.o: $(SRC)/%.cpp
	@mkdir -p $(@D)
	@$(CC) -g -c -o $@ $<

