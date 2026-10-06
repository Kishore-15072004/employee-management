package com.example.employeemanagement.dto;

public class AttendanceSummaryResponse {

    private long present;
    private long absent;
    private long halfDay;
    private long onLeave;

    public AttendanceSummaryResponse(
            long present,
            long absent,
            long halfDay,
            long onLeave) {

        this.present = present;
        this.absent = absent;
        this.halfDay = halfDay;
        this.onLeave = onLeave;
    }

    public long getPresent() {
        return present;
    }

    public long getAbsent() {
        return absent;
    }

    public long getHalfDay() {
        return halfDay;
    }

    public long getOnLeave() {
        return onLeave;
    }
}