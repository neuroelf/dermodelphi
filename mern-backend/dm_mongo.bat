REM starts mongodb (must be on the path) with dbpath set to mongodb subfolder
SET dbpath=%~dp0%
mongod --dbpath %dbpath%mongodb
