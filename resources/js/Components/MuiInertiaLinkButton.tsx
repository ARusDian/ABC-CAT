import { Link } from "@inertiajs/react";
import { Button } from "@mui/material";
import React from "react";

interface Props {
    href: string;
    children: React.ReactNode;
    color?: "primary" | "inherit" | "secondary" | "success" | "error" | "info" | "warning" ;
}

export default function MuiInertiaLinkButton({ href, children, color }: Props) {
    return (
        <Button
            type="button"
            variant="contained"
            size="large"
            color={color ?? "primary"}
            LinkComponent={Link}
            href={href}
            sx={{ marginY: 'auto' }}
        >
            {children}
        </Button>
    )
}
