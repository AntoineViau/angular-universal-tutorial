import { Component } from '@angular/core';
@Component({
    selector: 'content',
    template: `
    <div id="myCarousel" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner" role="listbox">
            <div class="item active">
                <div class="container">
                    <div class="carousel-caption">
                        <p>
                            <router-outlet>
                            </router-outlet>
                        </p>
                    </div>  
                </div>
            </div>
        </div>
    </div>    
    `
})
export class ContentComponent { }