
# Shutterstock Image Generation API - Apple Store Lekki Integration

This document outlines the integration of the Shutterstock API for generating and managing product images within the Apple Store Lekki application.

## Purpose

This integration addresses the issue of broken product images on the Apple Store Lekki website by implementing a centralized image service that can:
- Search for high-quality product images via the Shutterstock API
- Store and cache commonly used images
- Provide fallback images when primary images fail to load
- Track image usage across the application

## Features

- **Image Search:** Search the Shutterstock API for relevant images based on product descriptions or keywords
- **Image Retrieval:** Retrieve image URLs for display within the application
- **Licensing Management:** Handle image licensing for commercial use when required
- **Error Handling:** Implement robust error handling to manage API responses and potential issues
- **Caching:** Cache frequently accessed images to improve performance and reduce API calls
- **Storage:** Store images in the labeled storage bucket within the AppleStorelekki.com Supabase project

## Architecture

This implementation follows our shared services architecture pattern, where core functionality is centralized and made available to multiple applications:

```
Shared Media Service (Supabase Project)
├── Authentication Layer
│   └── Shutterstock API tokens/credentials
├── Cache Layer
│   └── Recently searched/used images
├── Usage Tracking
│   └── API quotas and billing
└── Business Logic
    ├── Image search
    ├── Licensing
    └── Download management
```

## Implementation Details

- **Edge Function:** An edge function will be created within the AppleStorelekki.com Supabase project to handle API requests and image retrieval
- **Supabase Client:** A `supabaseClientMedia.ts` file will be created to handle the Shutterstock API calls
- **Authentication:** The edge function will use the Shutterstock API keys stored securely in the Supabase environment
- **Image Storage:** Images will be stored in the labeled storage bucket in the AppleStorelekki.com Supabase project

## Setup Instructions

### 1. Shutterstock API Setup

1. Create a Shutterstock developer account at https://www.shutterstock.com/account/developers/apps
2. Create a new application and note the client ID and client secret
3. Ensure "Computer Vision" and "Self Serve" options are selected

### 2. Supabase Edge Function Setup

1. Navigate to your AppleStorelekki.com Supabase project
2. Go to Edge Functions and create a new function called `shutterstock-api`
3. Add the Shutterstock API credentials as secrets:
   ```bash
   supabase secrets set SHUTTERSTOCK_CLIENT_ID=your_client_id
   supabase secrets set SHUTTERSTOCK_CLIENT_SECRET=your_client_secret
   ```
4. Deploy the edge function with the implementation code

### 3. Client Integration

1. Import the media client in your application:
   ```typescript
   import { supabaseMedia } from '@/lib/supabase/supabaseClientMedia';
   ```
2. Use the client to search for and retrieve images:
   ```typescript
   const productImages = await supabaseMedia.searchProductImages('iphone 13 pro');
   ```

## API Reference

### Image Search

```typescript
// Search for images by keyword
searchImages(query: string, options?: SearchOptions): Promise<ImageSearchResult>

// Get similar images using computer vision
getSimilarImages(imageUrl: string): Promise<ImageSearchResult>

// Get product-specific images
searchProductImages(productName: string): Promise<ImageSearchResult>
```

### Image Licensing

```typescript
// License an image for commercial use
licenseImage(imageId: string): Promise<LicenseResult>

// Check licensing status
checkLicenseStatus(imageId: string): Promise<LicenseStatus>
```

### Image Storage

```typescript
// Store an image in Supabase storage
storeImage(imageUrl: string, path: string): Promise<StorageResult>

// Get a stored image URL
getStoredImageUrl(path: string): Promise<string>
```

## Error Handling

The implementation includes comprehensive error handling for:
- Authentication failures
- Rate limiting
- Network issues
- Missing images
- Licensing errors

## Testing

Test files will be stored in the labeled storage bucket within the AppleStorelekki.com Supabase project for evaluation and QA purposes.

## Usage Examples

### Basic Image Search
```typescript
// In your product display component
import { supabaseMedia } from '@/lib/supabase/supabaseClientMedia';

const ProductImage = ({ productName }) => {
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await supabaseMedia.searchProductImages(productName);
        if (result.data && result.data.length > 0) {
          setImageUrl(result.data[0].assets.preview.url);
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
      }
    };
    
    fetchImage();
  }, [productName]);
  
  return <img src={imageUrl || '/placeholder.jpg'} alt={productName} />;
};
```

### Using with Fallback
```typescript
import { useImage } from '@/hooks/useImage';

const ProductImage = ({ productName, productId }) => {
  const { imageUrl, isLoading, error } = useImage(productName, productId);
  
  if (isLoading) return <Skeleton height={300} width={300} />;
  if (error) return <FallbackImage />;
  
  return <img src={imageUrl} alt={productName} />;
};
```

## Maintenance

Regular monitoring and maintenance of the integration includes:
- API usage tracking to stay within rate limits
- Updating cached images periodically
- Monitoring for API changes or deprecations
- Reviewing and optimizing image search algorithms

---

This implementation represents a key component of our shared services architecture, allowing for efficient image management across multiple applications while maintaining a single source of truth for product imagery.
