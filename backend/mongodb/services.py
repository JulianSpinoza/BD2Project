import gridfs
from mongodb.client import db

fs = gridfs.GridFS(db, collection="listing_images")

def save_image_property(file):
    file_id = fs.put(
        file.read(), 
        filename=file.name, 
        content_type=file.content_type,
    )
    return str(file_id)
