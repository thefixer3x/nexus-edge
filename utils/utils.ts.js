lib/utils
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  snap?: boolean;
}

export function Section({ 
  className,
  snap = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'min-h-screen w-full py-16 px-4 sm:px-6 lg:px-8',
        snap && 'scroll-section',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto h-full">
        {children}
      </div>
    </section>
  );
}