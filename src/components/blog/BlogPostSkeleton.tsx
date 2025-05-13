
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPostSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 w-full bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
      
      <CardHeader>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="mt-2 h-4 w-24" />
        
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardHeader>
      
      <CardFooter className="pb-4">
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
  );
};

export default BlogPostSkeleton;
