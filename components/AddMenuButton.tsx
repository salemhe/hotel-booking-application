
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AddMenuButton() {

  return (
    <div className="flex">
      <Button ><Link href="menu/add">Add a Menu Item</Link></Button>
    </div>
  )
}

