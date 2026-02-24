import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getUserListings } from "@/lib/data";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    const userListings = getUserListings('current-user-id'); // ID is mocked in the function

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary font-headline">
                    My Dashboard
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Manage your car listings and account settings.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>My Active Listings</CardTitle>
                    <CardDescription>You have {userListings.length} active listings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                <TableHead>Car</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Price</TableHead>
                                <TableHead className="hidden md:table-cell">Posted</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userListings.map(listing => (
                                <TableRow key={listing.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image
                                            alt={`${listing.make} ${listing.model}`}
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={listing.images[0].url}
                                            width="64"
                                            data-ai-hint={listing.images[0].hint}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="font-bold">{listing.year} {listing.make} {listing.model}</div>
                                        <div className="text-sm text-muted-foreground">{listing.location}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">Active</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{listing.price.toLocaleString()} SAR</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(listing.postedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem asChild><Link href="/sell" className="flex items-center"><Pencil className="mr-2 h-4 w-4"/> Edit</Link></DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 flex items-center"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
