package com.learning.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {

    //client will send
    private String name;
    private String email;
    private String password;
}
