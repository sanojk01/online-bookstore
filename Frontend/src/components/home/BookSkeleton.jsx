import { Card, CardContent, Skeleton, Box } from "@mui/material";

export default function BookSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: '20px',          // BookCard ke saath match
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
      }}
    >
      {/* Image area — BookCard ki 230px height */}
      <Skeleton
        variant="rectangular"
        height={230}
        sx={{ bgcolor: '#f5f5f5' }}
      />

      {/* Body — BookCard ke bc-body padding 18px se match */}
      <CardContent sx={{ px: 2.3, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Stars */}
        <Skeleton width="45%" height={16} />
        {/* Title */}
        <Skeleton width="90%" height={22} />
        <Skeleton width="70%" height={22} />
        {/* Description */}
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%"  height={16} />
      </CardContent>

      {/* Footer — button */}
      <Box sx={{ px: 2.3, pb: 2.3, pt: 0 }}>
        <Skeleton
          variant="rectangular"
          height={42}
          sx={{ borderRadius: '12px' }}   // BookCard ke bc-btn borderRadius
        />
      </Box>
    </Card>
  );
}