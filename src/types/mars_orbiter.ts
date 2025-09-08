interface MarsOrbiter {
    id:number;
    sol:number;
    camera:{
        id:number;
        name:string;
        rover_id:number;
        full_name: string;
    };
    img_src:string;
    earth_date:string;
    rover:{
        id:number;
        name:string;
        landing_date:string;
        launch_date:string;
        status:string;
    }
}

export type { MarsOrbiter };