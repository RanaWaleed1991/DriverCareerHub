import boto3
from app.config import get_settings


class S3Service:
    """Handles S3 operations for media uploads."""

    def __init__(self) -> None:
        settings = get_settings()
        self._client = boto3.client(
            "s3",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        self._bucket = settings.S3_BUCKET_NAME

    def generate_presigned_upload_url(
        self, key: str, content_type: str, expiry: int = 3600
    ) -> str:
        """Generate a presigned PUT URL for direct browser upload."""
        return self._client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self._bucket,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=expiry,
        )
