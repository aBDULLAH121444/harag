export function Footer() {
    return (
      <footer className="bg-card border-t">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Haraj Al-Yemen. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  