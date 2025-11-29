<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessDbBackup;
use App\Models\DatabaseBackup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BackupController extends Controller
{
    public function index(){
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'System Maintenance', 'link' => route('database_backup.index')],
        ];

        return Inertia::render('SystemMaintenance/BackupDatabase', [
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    /**
     * Perform backup and saves the gzip to the file storage.
     */
    public function backup()
    {
        //put the backup process in the queue for background processing.
        $user_id = Auth::id();
        ProcessDbBackup::dispatch($user_id);
    }

    public function deleteBackup(Request $request): void
    {
        DatabaseBackup::destroy($request->id);
        unlink(storage_path('app/backup_database/'. $request->backup_file));
    }
}