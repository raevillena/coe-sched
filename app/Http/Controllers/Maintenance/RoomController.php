<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicManagement\UpdateActiveRequest;
use App\Http\Requests\RoomManagement\StoreBuildingRequest;
use App\Http\Requests\RoomManagement\StoreFloorPlanRequest;
use App\Http\Requests\RoomManagement\StoreFloorRequest;
use App\Http\Requests\RoomManagement\StoreRoomRequest;
use App\Http\Requests\RoomManagement\UpdateBuildingRequest;
use App\Http\Requests\RoomManagement\UpdateFloorRequest;
use App\Http\Requests\RoomManagement\UpdateFloorPlanRequest;
use App\Http\Requests\RoomManagement\UpdateFloorPlanActiveRequest;
use App\Http\Resources\Curriculum\AcademicProgramResource;
use App\Http\Resources\Maintenance\ControlBuildingResource;
use App\Http\Resources\Maintenance\ControlFloorResource;
use App\Http\Resources\Maintenance\FloorPlanResource;
use App\Models\Curriculum\AcademicPrograms;
use App\Models\MaintenanceManagement\ControlBuilding;
use App\Models\MaintenanceManagement\ControlFloor;
use App\Models\MaintenanceManagement\ControlRoom;
use App\Models\MaintenanceManagement\FloorPlan;
use App\Models\MaintenanceManagement\Rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Maintenance Management'],
            ['title' => 'Room Management', 'link' => route('room_management.index')],
        ];

        $floor_plans = FloorPlan::where('is_active', 1)->get();

        return Inertia::render('Maintenance/RoomManagement/Index', [
            'breadcrumbs' => $breadcrumbs,
            'floor_plans' => $floor_plans
        ]);
    }

    public function manage_facilities()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Maintenance Management'],
            ['title' => 'Room Management', 'link' => route('room_management.index')],
            ['title' => 'Manage Facilities', 'link' => route('room_management.manage_facilities')],
        ];

        $buildings = ControlBuildingResource::collection(ControlBuilding::all());
        $floors = ControlFloorResource::collection(ControlFloor::all());

        $academic_programs = AcademicProgramResource::collection(AcademicPrograms::where('is_active', 1)->get());

        return Inertia::render('Maintenance/RoomManagement/ManageFacilities', [
            'breadcrumbs' => $breadcrumbs,
            'buildings' => $buildings,
            'floors' => $floors,
            'academic_programs' => $academic_programs,
        ]);
    }

    //add floor plan
    public function add_floor_plan()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Maintenance Management'],
            ['title' => 'Room Management', 'link' => route('room_management.index')],
            ['title' => 'Add Floor Plan', 'link' => route('room_management.add_floor_plan')],
        ];

        $buildings = ControlBuildingResource::collection(ControlBuilding::where('is_active', 1)->get());
        $floors = ControlFloorResource::collection(ControlFloor::where('is_active', 1)->get());
        $academic_programs = AcademicProgramResource::collection(AcademicPrograms::where('is_active', 1)->get());

        return Inertia::render('Maintenance/RoomManagement/AddFloorPlan', [
            'breadcrumbs' => $breadcrumbs,
            'buildings' => $buildings,
            'floors' => $floors,
            'academic_programs' => $academic_programs
        ]);
    }

    public function check_building_floor(Request $request)
    {
        $request->validate([
            'building' => 'required',
            'floor' => 'required'
        ]);

        $building = $request->input('building');
        $floor = $request->input('floor');

        $exists = FloorPlan::where('building', $building)->where('floor', $floor)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function store_floor_plan(StoreFloorPlanRequest $request)
    {
        $store_floor_plan = $request->validated();

        $building = str_replace(' ', '', $request->input('building'));
        $floor = str_replace(' ', '', $request->input('floor'));

        if ($file = $request->file('floor_plan_map')) {
            $imageName = time() . '-' . $building . '-' . $floor . '-' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('floor_plan_images', $imageName, 'public');
            $store_floor_plan['floor_plan_map'] = $imagePath;
        } else {
            $store_floor_plan['floor_plan_map'] = null;
        }

        if (is_string($store_floor_plan['rectangles'])) {
            $rectangles = json_decode($store_floor_plan['rectangles'], true);
        } else {
            $rectangles = $store_floor_plan['rectangles'];
        }

        foreach ($rectangles as $index => &$rectangle) {
            if ($request->hasFile("room_image_{$index}")) {
                $roomImage = $request->file("room_image_{$index}");
                $roomImageName = time() . '-' . $building . '-' . $floor . '-' . $roomImage->getClientOriginalName();
                $roomImagePath = $roomImage->storeAs('room_images', $roomImageName, 'public');
                $rectangle['room_image'] = $roomImagePath;
            } else {
                $rectangle['room_image'] = null;
            }
        }

        $store_floor_plan['rectangles'] = $rectangles;

        //save floor plan
        FloorPlan::create($store_floor_plan);

        //save eachh room in the rectangles array to the rooms table
        foreach ($rectangles as $rect) {
            $room = new Rooms();
            $room->building = $store_floor_plan['building'];
            $room->floor = $store_floor_plan['floor'];
            $room->room_id = $rect['id'];
            $room->room_number = $rect['room_number'];
            $room->room_type = $rect['room_type'];
            $room->department_priority = $rect['department_priority'];
            $room->is_active = $rect['is_active'];
            $room->save();
        }

        return response()->json(['success' => 'Floor plan added successfully!']);
    }
    //end of add floor plan

    //edit floor plan
    public function edit_floor_plan()
    {
        $breadcrumbs = [
            ['title' => 'Dashboard', 'link' => route('dashboard')],
            ['title' => 'Maintenance Management'],
            ['title' => 'Room Management', 'link' => route('room_management.index')],
            ['title' => 'Edit Floor Plan', 'link' => route('room_management.edit_floor_plan')],
        ];

        $buildings = ControlBuildingResource::collection(ControlBuilding::where('is_active', 1)->get());
        $floors = ControlFloorResource::collection(ControlFloor::where('is_active', 1)->get());
        $academic_programs = AcademicProgramResource::collection(AcademicPrograms::where('is_active', 1)->get());
        $floor_plans = FloorPlan::all();

        return Inertia::render('Maintenance/RoomManagement/EditFloorPlan', [
            'breadcrumbs' => $breadcrumbs,
            'buildings' => $buildings,
            'floors' => $floors,
            'floor_plans' => $floor_plans,
            'academic_programs' => $academic_programs
        ]);
    }

    public function update_floor_plan(UpdateFloorPlanRequest $request, $id)
    {
        // Log::info('Updating floor plan with ID: ' . $id);

        $floor_plan = FloorPlan::findOrFail($id);
        $update_data = $request->validated();

        $building = str_replace(' ', '', $request->input('building'));
        $floor = str_replace(' ', '', $request->input('floor'));

        if ($file = $request->file('floor_plan_map')) {
            if ($floor_plan->floor_plan_map) {
                Storage::disk('public')->delete($floor_plan->floor_plan_map);
            }

            $imageName = time() . '-' . $building . '-' . $floor . '-' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('floor_plan_images', $imageName, 'public');
            $update_data['floor_plan_map'] = $imagePath;
        }

        if (is_string($update_data['rectangles'])) {
            $rectangles = json_decode($update_data['rectangles'], true);
        } else {
            $rectangles = $update_data['rectangles'];
        }

        foreach ($rectangles as $index => &$rectangle) {
            if ($request->hasFile("room_image_{$index}")) {
                if (isset($rectangle['room_image']) && $rectangle['room_image']) {
                    Storage::disk('public')->delete($rectangle['room_image']);
                }

                $roomImage = $request->file("room_image_{$index}");
                $roomImageName = time() . '-' . $building . '-' . $floor . '-' . $roomImage->getClientOriginalName();
                $roomImagePath = $roomImage->storeAs('room_images', $roomImageName, 'public');
                $rectangle['room_image'] = $roomImagePath;
            }
        }

        $update_data['rectangles'] = $rectangles;

        //update floor plan table
        $floor_plan->update($update_data);

        //update rooms table
        foreach ($rectangles as $rect) {
            Log::info("Processing room id: " . $rect['id']);

            // find existing room
            $room = Rooms::where('room_id', $rect['id'])
                        ->where('building', $floor_plan['building'])
                        ->where('floor', $floor_plan['floor'])
                        ->first();
    
            if ($room) {
                // update existing room details
                $room->room_number = $rect['room_number'];
                $room->room_type = $rect['room_type'];
                $room->department_priority = $rect['department_priority'];
                $room->building = $floor_plan['building'];
                $room->floor = $floor_plan['floor'];
                // Log::info("Updating room: " . json_encode($rect));
            } else {
                //create a new room if it doesn't exist
                $room = new Rooms();

                $room->room_id = $rect['id'];
                $room->building = $floor_plan['building'];
                $room->floor = $floor_plan['floor'];
                $room->room_number = $rect['room_number'];
                $room->room_type = $rect['room_type'];
                $room->department_priority = $rect['department_priority'];
                $room->is_active = $rect['is_active'];
                // Log::info("Creating new room: " . json_encode($rect));
            }
            $room->save();
            // Log::info("Room saved successfully: " . json_encode($room));
        }

        return redirect()->route('room_management.index')->with('success', 'Floor Plan updated successfully!');
    }
    //end of edit floor plan

    //floor management
    public function store_floor(StoreFloorRequest $request)
    {
        $store_floor = $request->validated();

        $existingFloor = ControlFloor::where('floor_name', $request->floor_name)->first();
        if ($existingFloor) {
            return response()->json([
                'message' => 'A floor with this name already exists.'
            ], 400);
        }

        ControlFloor::create($store_floor);

        return response()->json(['success' => 'Floor added successfully!']);
    }

    public function update_floor(UpdateFloorRequest $request, ControlFloor $floors)
    {
        $floors->update($request->validated());

        return response()->json([
            'success' => 'Floor updated successfully!',
            'control_floors' => $floors
        ]);
    }

    public function update_floor_active_status(UpdateActiveRequest $request, ControlFloor $floors)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];

        $floors->where('floor_name', $floors->floor_name)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Floor active status updated successfully!']);
    }

    //building management
    public function store_building(StoreBuildingRequest $request)
    {
        $store_building = $request->validated();

        $existingBuilding = ControlBuilding::where('building_name', $request->building_name)->first();
        if ($existingBuilding) {
            return response()->json([
                'message' => 'A building with this name already exists.'
            ], 400);
        }

        ControlBuilding::create($store_building);

        return response()->json(['success' => 'Building added successfully!']);
    }

    public function update_building(UpdateBuildingRequest $request, ControlBuilding $buildings)
    {
        $buildings->update($request->validated());

        return response()->json([
            'success' => 'Building updated successfully!',
            'control_buildings' => $buildings
        ]);
    }

    public function update_building_active_status(UpdateActiveRequest $request, ControlBuilding $buildings)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];

        $buildings->where('building_name', $buildings->building_name)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Building active status updated successfully!']);
    }

    public function update_floor_plan_active_status(UpdateFloorPlanActiveRequest $request)
    {
        $validated = $request->validated();
        $is_active = $validated['is_active'];
        $building = $validated['building'];
        $floor = $validated['floor'];

        //get building and floor first
        $floor_plan = FloorPlan::where('building', $building)
            ->where('floor', $floor)
            ->first();

        if (!$floor_plan) {
            return response()->json(['error' => 'Floor Plan not found'], 404);
        }

        // Log::info('Update Floor Plan Active Status:', [
        //     'building' => $floor_plan->building,
        //     'floor' => $floor_plan->floor,
        //     'is_active' => $is_active
        // ]);

        $floor_plan->update(['is_active' => $is_active]);

        Rooms::where('building', $building)
            ->where('floor', $floor)
            ->update(['is_active' => $is_active]);

        return response()->json(['success' => 'Floor Plan active status updated successfully!']);
    }

    /**
     * Check if a room exists in the database.
     */
    public function checkRoom(Request $request)
    {
        $request->validate(['room' => 'required|string']);
        $exists = Rooms::where('room_number', $request->input('room'))->exists();
        return response()->json(['exists' => $exists]);
    }
}
