package com.learning.authify.service;

import com.learning.authify.io.ProfileRequest;
import com.learning.authify.io.ProfileResponse;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest request);
}
