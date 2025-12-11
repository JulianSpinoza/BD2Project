# How to start the backend

## Poetry install dependecies and virtual environment

Install poetry globally on your device using the next command:

```
pip install poetry
```
Being on the frontend folder, install the dependecies of the project with:
```
poetry install
```
> [!NOTE]
> Inspect with `poetry env list` if you have an active virtual environment. Otherwise, activate it with `poetry shell`, but if you prefer to select it please use `poetry env use [name_of_env]`. At last, if you haven't a poetry virtual environment, create one with `poetry env use [pythonVersion]`.

Don't forget to create an `.env` file on this backend folder, follow the [`.env.example`](/backend/.env.example) file apply the correct format.

Start all databases migrations files with:
```
poetry run python manage.py migrate
```
And finally, to start the backend:
```
poetry run python manage.py runserver
```
