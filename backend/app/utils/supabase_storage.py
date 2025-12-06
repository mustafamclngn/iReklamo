import os
import uuid
from supabase import create_client, Client
from werkzeug.datastructures import FileStorage
from typing import Optional, Tuple

class SupabaseStorage:
    
    def __init__(self, url: str, key: str, bucket_name: str):
        self.client: Client = create_client(url, key)
        self.bucket_name = bucket_name
        
    def upload_file(
        self, 
        file: FileStorage, 
        folder: str = "",
        custom_filename: Optional[str] = None
    ) -> Tuple[bool, Optional[str], Optional[str]]:

        try:
            if not file or file.filename == '':
                return False, None, "No file provided"
            
            if custom_filename:
                filename = custom_filename
            else:
                file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
                unique_id = uuid.uuid4().hex[:8]
                filename = f"{unique_id}.{file_extension}" if file_extension else unique_id
            
            file_path = f"{folder}/{filename}" if folder else filename
            
            file_data = file.read()
            
            content_type = file.content_type or 'application/octet-stream'
            
            response = self.client.storage.from_(self.bucket_name).upload(
                path=file_path,
                file=file_data,
                file_options={
                    "content-type": content_type,
                    "upsert": "true"
                }
            )
            
            public_url = self.client.storage.from_(self.bucket_name).get_public_url(file_path)
            
            return True, file_path, public_url
            
        except Exception as e:
            print(f"Error uploading file to Supabase: {e}")
            return False, None, str(e)
    
    def delete_file(self, file_path: str) -> Tuple[bool, Optional[str]]:
        try:
            self.client.storage.from_(self.bucket_name).remove([file_path])
            return True, None
            
        except Exception as e:
            print(f"Error deleting file from Supabase: {e}")
            return False, str(e)
    
    def get_public_url(self, file_path: str) -> str:
        return self.client.storage.from_(self.bucket_name).get_public_url(file_path)

def init_supabase_storage(url: str, key: str, bucket_name: str) -> SupabaseStorage:
    storage = SupabaseStorage(url, key, bucket_name)
    return storage