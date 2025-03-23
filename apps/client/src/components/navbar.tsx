import { Home } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <div className="flex sticky top-0 w-full items-center justify-between p-4">
      <div>
        <Home />
      </div>

      <div>
        <ModeToggle />
      </div>
    </div>
  );
}
