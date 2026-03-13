export default function main() {
    Deno.cron("cleanup-old-data", "0 * * * *", () => {
    // Runs every hour
    console.log("Cleaning up old data...");
    });

    Deno.cron("daily-report", "0 9 * * *", () => {
    // Runs daily at 9:00 AM
    console.log("Generating daily report...");
    });
}