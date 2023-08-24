<?php

namespace App\Policies;

use App\Models\LearningPacket;
use App\Models\User;
use App\Models\UserLearningPacket;
use Illuminate\Auth\Access\Response;

class LearningPacketPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LearningPacket $learningPacket): bool
    {
        return UserLearningPacket::ofUser($user->id)
            ->ofPacket($learningPacket->id)
            ->count() == 1;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LearningPacket $learningPacket): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LearningPacket $learningPacket): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LearningPacket $learningPacket): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(
        User $user,
        LearningPacket $learningPacket,
    ): bool {
        return false;
    }
}
