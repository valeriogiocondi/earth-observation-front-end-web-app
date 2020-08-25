class FullScreen {

    doc: any;

    constructor() {

        this.doc = document.documentElement;
    }

    public open(): void {

        if (this.doc.requestFullscreen) {

            this.doc.requestFullscreen();

        } else if (this.doc.mozRequestFullScreen) { /* Firefox */

            this.doc.mozRequestFullScreen();

        } else if (this.doc.webkitRequestFullscreen) { /* Chrome, Safari and Opera */

            this.doc.webkitRequestFullscreen();

        } else if (this.doc.msRequestFullscreen) { /* IE/Edge */

            this.doc.msRequestFullscreen();

        }
   }
   
   public close(): void {

        if (this.doc.exitFullscreen) {

            this.doc.exitFullscreen();
            
        } else if (this.doc.mozCancelFullScreen) { /* Firefox */

            this.doc.mozCancelFullScreen();
            
        } else if (this.doc.webkitExitFullscreen) { /* Chrome, Safari and Opera */

            this.doc.webkitExitFullscreen();
            
        } else if (this.doc.msExitFullscreen) { /* IE/Edge */

            this.doc.msExitFullscreen();
            
        }
   }
}

// SINGLETON
// Export an instance of the class directly
export default new FullScreen();