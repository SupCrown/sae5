package com.aramis.utils;

import lombok.Getter;

@Getter
public enum EPrepareStatus {
    Pending(1),
    Preparing(2),
    Done(4);

    private final int value;

    EPrepareStatus(int value) {
        this.value = value;
    }
}
