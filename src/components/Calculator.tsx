
import { Calculator as CalculatorIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Calculator() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value: string) => {
    if (value === "=") {
      try {
        setResult(eval(display).toString());
      } catch (error) {
        setResult("Error");
      }
    } else if (value === "C") {
      setDisplay("");
      setResult("");
    } else {
      setDisplay(display + value);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full transition-transform hover:scale-110">
          <CalculatorIcon className="h-5 w-5" />
          <span className="sr-only">Open calculator</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scientific Calculator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Input
            value={display}
            readOnly
            className="text-right text-lg font-mono"
          />
          <div className="text-right text-sm text-muted-foreground font-mono">
            {result}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["7", "8", "9", "/",
              "4", "5", "6", "*",
              "1", "2", "3", "-",
              "0", ".", "=", "+",
              "C", "sin", "cos", "tan",
              "(", ")", "√", "^"
            ].map((btn) => (
              <Button
                key={btn}
                variant="outline"
                onClick={() => handleClick(btn)}
              >
                {btn}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
