package com.example.employeemanagement.dto;

public class LeaveSummaryResponse {

    private long pending;
    private long approved;
    private long rejected;
    private long cancelled;

    public LeaveSummaryResponse(
            long pending,
            long approved,
            long rejected,
            long cancelled) {

        this.pending = pending;
        this.approved = approved;
        this.rejected = rejected;
        this.cancelled = cancelled;
    }

    public long getPending() {
        return pending;
    }

    public long getApproved() {
        return approved;
    }

    public long getRejected() {
        return rejected;
    }

    public long getCancelled() {
        return cancelled;
    }
}