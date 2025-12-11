from mongodb.services import fs

file_id = fs.put(b"hola", filename="test.txt")
print("ID:", file_id)
