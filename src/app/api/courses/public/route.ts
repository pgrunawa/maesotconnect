// src/app/api/courses/public/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Fetch courses with the updated schema fields
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        titleMm: true,
        subtitle: true,
        subtitleMm: true,
        // location/locationMm fields no longer exist in the schema
        startDate: true,
        startDateMm: true,
        endDate: true, // New field
        endDateMm: true, // New field
        duration: true,
        durationMm: true,
        province: true, // New field
        district: true, // New field
        schedule: true,
        address: true, // ADD THIS LINE
        applyByDate: true, // ADD THIS LINE
        applyByDateMm: true, // ADD THIS LINE
        scheduleMm: true,
        // fee/feeMm fields are replaced with feeAmount/feeAmountMm
        feeAmount: true, // New field
        feeAmountMm: true, // New field
        ageMin: true, // New field
        ageMinMm: true, // New field
        ageMax: true, // New field
        ageMaxMm: true, // New field
        document: true, // New field
        documentMm: true, // New field
        availableDays: true,
        description: true,
        descriptionMm: true,
        outcomes: true,
        outcomesMm: true,
        scheduleDetails: true,
        scheduleDetailsMm: true,
        selectionCriteria: true,
        selectionCriteriaMm: true,
        howToApply: true,
        howToApplyMm: true,
        applyButtonText: true,
        applyButtonTextMm: true,
        applyLink: true,
        estimatedDate: true,
        estimatedDateMm: true,
        organizationInfo: {
          select: {
            id: true,
            name: true,
            description: true,
            phone: true,
            email: true,
            address: true,
            facebookPage: true,
            latitude: true,
            longitude: true,
            district: true, // New field
            province: true, // New field
            logoImage: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            courseId: true,
          },
        },
        badges: {
          select: {
            id: true,
            text: true,
            color: true,
            backgroundColor: true,
            courseId: true,
          },
        },
        faq: {
          select: {
            question: true,
            questionMm: true,
            answer: true,
            answerMm: true,
          },
        },
      },
    });

    // Format the response to ensure dates are serialized properly
    // and to maintain backward compatibility
    const formattedCourses = courses.map((course) => ({
      ...course,
      // Convert DateTime objects to ISO strings
      startDate: course.startDate.toISOString(),
      startDateMm: course.startDateMm ? course.startDateMm.toISOString() : null,
      endDate: course.endDate.toISOString(),
      endDateMm: course.endDateMm ? course.endDateMm.toISOString() : null,
      applyByDate: course.applyByDate ? course.applyByDate.toISOString() : null, // ADD THIS LINE
      applyByDateMm: course.applyByDateMm
        ? course.applyByDateMm.toISOString()
        : null, // ADD THIS LINE
      estimatedDate: course.estimatedDate, // Add this line
      estimatedDateMm: course.estimatedDateMm,
      howToApply: course.howToApply || [],
      howToApplyMm: course.howToApplyMm || [],
      applyButtonText: course.applyButtonText,
      applyButtonTextMm: course.applyButtonTextMm,
      applyLink: course.applyLink,
      // Build location from course district/province only
      location:
        [course.district, course.province]
          .filter(Boolean)
          .join(", ") || "",
      locationMm: null, // Keep for backward compatibility
      // Add empty fee fields for backward compatibility
      fee: course.feeAmount ? course.feeAmount.toString() : "",
      feeMm: course.feeAmountMm ? course.feeAmountMm.toString() : null,
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error("Error fetching public courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
