<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\LearningCategory;
use App\Models\User;
use App\Models\UserLearningCategory;

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
        //
        if($user->hasRole('instructor')){
            return UserLearningCategory::ofUser($user->id)->ofCategory($learningCategory->id)->count() == 1; 
        }
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
        return $user->hasRole('super-admin') || $user->hasRole('admin');
    }
    

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LearningCategory $learningCategory): bool
    {
        //
        return $user->hasRole('super-admin') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LearningCategory $learningCategory): bool
    {
        //
        return $user->hasRole('super-admin') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LearningCategory $learningCategory): bool
    {
        //
        return $user->hasRole('super-admin') || $user->hasRole('admin');

    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LearningCategory $learningCategory): bool
    {
        //
    }
}
