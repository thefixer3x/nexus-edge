
# Shutterstock Image Generation API - Apple Store Lekki Integration

This document outlines the integration of the Shutterstock API for generating and managing product images within the Apple Store Lekki application.

## API Rate Limits

- **Free Image Search**: 100 requests per hour
- **Computer Vision**: 5 requests per minute
- **Image Type**: Commercial license images for Apple products

## Search Parameters Configuration

```typescript
const searchParameters = {
  query: "apple product white background professional",
  image_type: ["photo"],
  orientation: "square",
  per_page: 5,
  sort: "relevance",
  view: "full",
  aspect_ratio: 1,
  people_model_released: true,
  safe: true
};
```

## API Credentials

The API credentials are securely stored in the Supabase vault:
- Subscription ID
- Project ID
- Consumer Key
- Consumer Secret
- Token

## Image Search Guidelines

### Optimized Search Terms:
- Use "apple product" as base term
- Add descriptive modifiers: "professional", "white background", "studio shot"
- Specify product type: "MacBook", "iPhone", "iPad", etc.
- Include quality indicators: "high resolution", "commercial"

### Best Practices:
1. **Rate Limit Management**
   - Cache frequently used images
   - Implement rate limit tracking
   - Use bulk search for multiple products

2. **Image Selection**
   - Prioritize white/neutral backgrounds
   - Ensure consistent aspect ratios
   - Verify commercial licensing
   - Check image resolution requirements

3. **Error Handling**
   - Implement fallback images
   - Cache successful searches
   - Monitor rate limit headers

## Storage Configuration

Images are stored in the labeled storage bucket within the AppleStorelekki.com Supabase project:

```
apple-store-images/
├── products/
│   ├── cached/
│   └── original/
└── temp/
```

## Testing Guidelines

1. **Rate Limit Testing**
   - Monitor hourly usage
   - Track computer vision requests
   - Log rate limit headers

2. **Image Quality Verification**
   - Resolution checks
   - Background consistency
   - Product alignment
   - Color accuracy

## Implementation Notes

- All API calls are routed through Supabase Edge Functions
- Credentials are managed via Supabase Secrets
- Rate limiting is handled at the Edge Function level
- Images are cached in Supabase Storage
- Response times and success rates are monitored

