package flightbooking.com.backend.utils;

import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
public class TimeFormat {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public String formatDateTime(String isoDateTime) {
        LocalDateTime dateTime = LocalDateTime.parse(isoDateTime, DATE_TIME_FORMATTER);
        return dateTime.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + ", " +
                dateTime.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " +
                dateTime.getDayOfMonth() + ", " + dateTime.getYear() + " at " +
                dateTime.getHour() + ":" + String.format("%02d", dateTime.getMinute());
    }

    public String formatDuration(String isoDuration) {
        Duration duration = Duration.parse(isoDuration);
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        return hours + "h " + minutes + "m";
    }

    public Duration parseDuration(String duration) {
        return Duration.parse(duration);
    }
}
