import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    try {
      // Find admin user in database
      const admin = await db.adminUser.findUnique({
        where: { username },
      });

      if (admin) {
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (isPasswordMatch) {
          return NextResponse.json({
            success: true,
            token: "admin-secure-token-12345",
            message: "Login successful",
          });
        }
      }

      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    } catch (dbError) {
      console.error("Database lookup failed during login:", dbError);
      return NextResponse.json(
        { success: false, message: "Authentication server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
