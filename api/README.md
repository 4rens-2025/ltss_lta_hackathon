# API Documentation

## Getting Started

### Setting Up Python Interpreter in VS Code

To set up the Python interpreter in Visual Studio Code, follow these steps:

1. Open the Command Palette (Ctrl+Shift+P) and select `Python: Select Interpreter`.
2. Choose the interpreter located at `.venv/bin/python3`.

This will configure VS Code to use the specified Python interpreter for your project.

### Installing Dependencies
To install dependencies, use the following command:
```sh
uv add <dependency>
```

### Syncing Packages
To sync the packages, use the following command:
```sh
uv sync
```

### Running the Application
To run the application, use the following command:
```sh
uv run fastapi dev
```
### Accessing API Documentation
After running the application, navigate to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to access the API documentation.