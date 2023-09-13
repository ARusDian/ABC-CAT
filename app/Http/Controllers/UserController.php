<?php

namespace App\Http\Controllers;

use App\Exports\ExamResultExport;
use App\Exports\UsersExport;
use App\Exports\UsersTemplateExport;
use App\Imports\UsersImport;
use App\Models\Exam;
use App\Models\LearningCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelExcel;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = User::withTrashed()
            ->with('roles')
            ->whereColumns($request->get('columnFilters'))
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('perPage') ?? 10);
        return Inertia::render('Admin/User/Index', [
            'users' => $user,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $roles = Role::all();
        $learning_categories = LearningCategory::with([
            'subLearningPacket.learningPacket',
        ])
            ->get();
        return Inertia::render('Admin/User/Create', [
            'roles' => $roles,
            'learning_categories' => $learning_categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, bool $is_import = false)
    {
        //
        return DB::transaction(function () use ($request, $is_import) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'roles.*.id' => 'required|exists:roles',
                'phone_number' => 'required|string',
                'photo.file' => 'nullable|max:2048',
                'address' => 'required|string',
                'gender' => 'required|in:L,P',
                'learning_categories.*.id' =>
                'exists:learning_categories,id|distinct|required_if:roles.*.name,==,instructor',
            ]);
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone_number' => $validated['phone_number'],
                'active_year' => date('Y'),
                'address' => $validated['address'],
                'gender' => $validated['gender'],
            ]);

            if (isset($request['photo']['file'])) {
                $user->updateProfilePhoto($request['photo']['file']);
            }

            if (isset($validated['learning_categories'])) {
                $user->learningCategories()->attach(
                    array_map(function ($learning_category) {
                        return $learning_category['id'];
                    }, $validated['learning_categories'] ?? []),
                );
            }

            foreach ($validated['roles'] as $role) {
                $user->assignRole($role['id']);
            }
            if (!$is_import) {
                activity()
                    ->performedOn($user)
                    ->causedBy(Auth::user())
                    ->withProperties(['method' => 'CREATE'])
                    ->log('Created User ' . $user->name . '');
            }

            return redirect()
                ->route('user.index')
                ->banner('New User Created Successfully');
        });
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $user = User::withTrashed()
            ->with(['roles', 'learningCategories.subLearningPacket.learningPacket'])
            ->find($id);
        return Inertia::render('Admin/User/Show', [
            'user_data' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        $user = User::withTrashed()
            ->with([
                'roles',
                'learningCategories.subLearningPacket.learningPacket',
            ])
            ->find($id);
        $roles = Role::all();
        $learning_categories = LearningCategory::with([
            'subLearningPacket.learningPacket'
        ])
            ->get();
        return Inertia::render('Admin/User/Edit', [
            'user_data' => $user,
            'roles' => $roles,
            'learning_categories' => $learning_categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        return DB::transaction(function () use ($request, $id) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|',
                'password' => 'nullable|string|min:8',
                'roles.*.id' => 'required|exists:roles',
                'phone_number' => 'required|string',
                'active_year' => 'required|numeric',
                'photo' => 'nullable|max:2048',
                'photo_profile_path' => 'nullable|string',
                'address' => 'required|string',
                'gender' => 'required|in:L,P',
                'learning_categories.*.id' =>
                'exists:learning_categories,id|distinct|required_if:roles.*.name,==,instructor',
            ]);

            $user = User::findOrFail($id);
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'active_year' => $validated['active_year'],
                'address' => $validated['address'],
                'gender' => $validated['gender'],
            ]);

            if (isset($request['photo']['file'])) {
                $user->updateProfilePhoto($request['photo']['file']);
            }

            if (isset($validated['learning_categories'])) {
                $user->learningCategories()->sync(
                    array_map(function ($learning_category) {
                        return $learning_category['id'];
                    }, $validated['learning_categories'] ?? []),
                );
            }

            if (isset($validated['password'])) {
                $user->update([
                    'password' => Hash::make($validated['password']),
                ]);
            }
            $user->syncRoles($validated['roles'] ?? []);
            $user->save();
            activity()
                ->performedOn($user)
                ->causedBy(Auth::user())
                ->withProperties(['method' => 'UPDATE'])
                ->log('Updated User ' . $user->name . '');
            return redirect()
                ->route('user.show', $id)
                ->banner('User Updated Successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $user = User::findOrFail($id);
        $user->delete();
        activity()
            ->performedOn($user)
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'DELETE'])
            ->log('Deleted User ' . $user->name . '');
        return redirect()
            ->route('user.index')
            ->banner('User Deleted Successfully');
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        activity()
            ->performedOn($user)
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'RESTORE'])
            ->log('Restored User ' . $user->name . '');
        return redirect()
            ->route('user.index')
            ->banner('User Restored Successfully');
    }

    public function forceDelete($id)
    {
        return DB::transaction(function () use ($id) {
            $user = User::withTrashed()
                ->with(['userLearningPackets', 'exams.answers', 'instructorLearningCategories'])
                ->findOrFail($id);

            if ($user->hasRole('super-admin')) {
                return redirect()
                    ->route('user.show', $id)
                    ->banner('Superadmin Cannot Be Deleted');
            }

            if ($user->exams()->count() > 0) {
                foreach ($user->exams as $exam) {
                    if ($exam->answers()->count() > 0) {
                        foreach ($exam->answers as $answer) {
                            $answer->delete();
                        }
                    }
                    $exam->delete();
                }
            }

            if ($user->userLearningPackets()->count() > 0) {
                foreach ($user->userLearningPackets as $userLearningPacket) {
                    $userLearningPacket->delete();
                }
            }

            if ($user->instructorLearningCategories()->count() > 0) {
                foreach ($user->instructorLearningCategories as $instructorLearningCategory) {
                    $instructorLearningCategory->delete();
                }
            }

            $user->forceDelete();

            activity()
                ->performedOn($user)
                ->causedBy(Auth::user())
                ->withProperties(['method' => 'FORCE_DELETE'])
                ->log('Force Deleted User ' . $user->name . '');
            return redirect()
                ->route('user.index')
                ->banner('User Force Deleted Successfully');
        });
    }

    public function ImportExportView()
    {
        return Inertia::render('Admin/User/ImportExport', []);
    }

    public function import(Request $request)
    {
        $request->validate([
            'import_file' => 'required',
        ]);
        try {
            Excel::import(
                new UsersImport(),
                $request->file('import_file.file')->store('temp'),
                null,
                ExcelExcel::XLSX,
            );
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            // TODO: Return the errors to view 
            $import_failures = $e->failures();
            $errors = array_map(function ($import_failure) {
                return [
                    'row' => $import_failure->row(),
                    'attribute' => $import_failure->attribute(),
                    'errors' => $import_failure->errors(),
                ];
            }, $import_failures);
            session()->flash('import_failures', $errors);
            return redirect()
                ->route('user.index');
        }
        activity()
            ->performedOn(User::find(Auth::user()->id))
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'IMPORT'])
            ->log('Imported Users');
        return redirect()
            ->route('user.index')
            ->banner('User Imported Successfully');
    }

    public function export()
    {
        activity()
            ->performedOn(User::find(Auth::user()->id))
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'EXPORT'])
            ->log('Exported Users');
        return Excel::download(
            new UsersExport(),
            'users.xlsx',
            ExcelExcel::XLSX,
        );
    }

    public function template()
    {
        return Excel::download(
            new UsersTemplateExport(),
            'users_template.xlsx',
            ExcelExcel::XLSX,
        );
    }

    public function exportExamResult($id)
    {
        $user = User::find($id);
        $exams = Exam::where('user_id', $id)
            ->with([
                'exerciseQuestion.learningCategory.subLearningPacket.learningPacket',
                'user' => fn ($q) => $q->select('id', 'name', 'email'),
            ])
            ->withScore()
            ->ofFinished(true)
            ->get();

        activity()
            ->performedOn($user)
            ->causedBy(Auth::user())
            ->withProperties(['method' => 'EXPORT'])
            ->log('Exported Exam Result');
        return Excel::download(
            new ExamResultExport(
                $exams,
                'Hasil Latihan Pengguna ' . $user->name . ' - ' . $user->email,
                ExcelExcel::XLSX,
            ),
            'Hasil Ujian Pengguna.xlsx',
        );
    }

    public function exams($id)
    {
        $user = User::select('id', 'name', 'email')
            ->with([
                'exams' => fn ($q) => $q
                    ->with([
                        'exerciseQuestion.learningCategory.subLearningPacket.learningPacket',
                    ])
                    ->withScore()
                    ->ofFinished(true)
                    ->orderBy('created_at', 'desc'),
            ])
            ->find($id);
        return Inertia::render('Admin/User/Exam/Index', [
            'user_data' => $user,
        ]);
    }

    public function examShow($user_id, $id)
    {
        return Inertia::render('Admin/User/Exam/Evaluation', [
            'exam' => Exam::with([
                'exerciseQuestion.learningCategory.subLearningPacket.learningPacket',
                'answers.question',
                'user' => fn ($q) => $q->select('id', 'name', 'email'),
            ])
                ->withScore()
                ->ofFinished(true)
                ->find($id),
        ]);
    }

    public function examResult($user_id, $id)
    {
        return Inertia::render('Admin/User/Exam/Result', [
            'exam' => Exam::with([
                'exerciseQuestion.learningCategory',
                'user' => fn ($q) => $q->select('id', 'name', 'email'),
            ])
                ->withScore()
                ->ofFinished(true)
                ->findOrFail($id)
                ->appendResult(),
        ]);
    }
}
