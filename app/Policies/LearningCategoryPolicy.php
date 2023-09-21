<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\LearningCategory;
use App\Models\User;
use App\Models\InstructorLearningCategory;

class LearningCategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LearningCategory $learningCategory): bool
    {
        return $this->hasAccess($user, $learningCategory);
    }

    public function hasAccess(
        User $user,
        LearningCategory $learningCategory = null,
    ): bool {
        if ($user->hasRole('admin') || $user->hasRole('super-admin')) {
            return true;
        }

        if ($learningCategory && $user->hasRole('instructor')) {
            return InstructorLearningCategory::ofUser($user->id)
                ->ofCategory($learningCategory->id)
                ->count() == 1;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->hasAccess($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LearningCategory $learningCategory): bool
    {
        return $this->hasAccess($user, $learningCategory);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LearningCategory $learningCategory): bool
    {
        return $this->hasAccess($user, $learningCategory);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(
        User $user,
        LearningCategory $learningCategory,
    ): bool {
        return $this->hasAccess($user, $learningCategory);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(
        User $user,
        LearningCategory $learningCategory,
    ): bool {
        return $this->hasAccess($user);
    }
}
