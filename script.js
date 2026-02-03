let bookData = [];
let charts = {};

// File upload handler
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    document.getElementById('fileName').textContent = `Loaded: ${file.name}`;
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const data = event.target.result;
        
        if (file.name.endsWith('.csv')) {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    processData(results.data);
                }
            });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            processData(jsonData);
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
});

function loadSampleData() {
    // Using the actual data from the document
    const sampleCSV = `Title,Author,Genre,Publish Date,Publisher,Format,Illustrator,Total Pages,Rating,Status (Read or Not),MSRP,Special Edition?,ISBN
Grimm: Aunt Marie's Book of Lore,Titan Books,Fantasy/Paranormal,November 8th 2013,Titan Books,Paperback,Titan Books,144,,No,$19.95,No,978-1-781-16653-6
The Holy Bible,Moses wrote the most of 1 person,Religious Text,August 28th 2018,Zonderkidz,Leatherbound,David Malan,1077,4.75/5,Yes,$36.99,NIV - Incredible Creatures and Creations,978-0-310-76123-5
Wash Day Diaries,Jamila Rowser,Young Adult Fiction,July 5th 2022,Chronicle Books,Graphic Novel,Robyn Smith,191,4.5/5,Yes,$19.95,No,978-1-7972-0545-8
LegendBorn,Tracy Deonn,Young Adult/Fantasy,September 15th 2020,Margaret K. McElderry Books,Hardcover,N/A,501,4.0/5,Yes,$19.99,No,978-1-5344-4160-6
BloodMarked,Tracy Deonn,Young Adult/Fantasy,November 8th 2022,Simon & Schuster Books for Young Readers,Hardcover,N/A,561,5.0/5,Yes,$19.99,Barnes & Noble Exclusive Edition,978-1-6659-3199-1
Percy Jackson & The Olympians: The Lightning Thief,Rick Riordan,Fantasy/Adventure,December 29th 2009,Disney-Hyperion,Hardcover,John Rocco,377,4.0/5,Yes,$25.00,Deluxe Collectors Edition (still in wrap),978-142312170-1
Percy Jackson &The Olympians: The Lightning Thief,Rick Riordan,Fantasy/Adventure,December 29th 2009,Disney-Hyperion,Hardcover,John Rocco,377,4.0/5,Yes,$25.00,Deluxe Collectors Edition (not in wrap),978-142312170-1
Prodigy: The Icarus Society (Prodigy 2),Mark Millar,Action/Adventure,January 17th 2023,Image Comics,Comic Book,Matteo Buffagni,144,,No,$15.99,No,978-1-5343-2455-8
Nubia: Real One,L.L. McKinney,Young Adult Fiction,February 23rd 2021,DC Comics,Graphic Novel,Robyn Smith,205,4.5/5,Yes,$16.99,No,978-1-4012-9640-7
Ms. Marvel Vol. 3 - Crushed,G. Willow Wilson & Mark Waid,Superhero,June 9th 2015,Marvel Universe,Comic Book,Takeshi Miyazawa Elmo Bondoc Ian Herring Irma Kniivila,112,,No,$15.99,No,978-0-7851-9227-5
We Are Not Like Them,Christine Pride & Jo Piazza,Contemporary Literature,October 5th 2021,Atria Books,Paperback,N/A,315,,No,$17.00,No,978-1-9821-8104-8
The Right Swipe,Alisha Rai,Romance,August 6th 2019,Avon Books,Paperback,N/A,388,,No,$14.99,No,978-0-06-297667-3
Percy Jackson & The Olympians: The Lightning Thief,Rick Riordan,Fantasy/Adventure,July 1st 2005,Miramax Books - Hyperion,Hardcover,N/A,377,4.0/5,Yes,$17.95,First Edition,078685629-7
Percy Jackson & The Olympians: The Lightning Thief,Rick Riordan,Fantasy/Adventure,May 12th 2015,Disney-Hyperion,Hardcover,N/A,377,4.0/5,Yes,$17.99,Barnes & Noble Exclusive Collector's Edition (10 Year Edition),978-148472240-0
Midnight Flower's Kiss,Alexis Jade,Adult Fantasy,May 27th 2021,Independently Published,Paperback,N/A,558,,No,$15.99,No,979-8511342726
Grimm: The Icy Touch,John Shirley,Fantasy/Paranormal,November 5th 2013,Titan Books,Paperback,N/A,313,,No,$7.99,No,978-1781166543
Grimm: The Killing Time,Tim Waggoner,Fantasy/Paranormal,September 30th 2014,Titan Books,Paperback,N/A,265,,No,$7.99,No,978-1781166581
Percy Jackson And The Singer of Apollo,Rick Riordan,Fantasy/Adventure,February 28th 2019,Puffin Books,Paperback,N/A,112,3.75/5,Yes,$1.00,No,978-0-241-38073-4
LegendBorn,Tracy Deonn,Young Adult/Fantasy,September 15th 2020,Margaret K. McElderry Books,Paperback,N/A,501,4.0/5,Yes,$13.99,No,978-1-5344-4161-3
Diary of a Wimpy Kid #17: Diper Överlöde,Jeff Kinney,Comedy,October 25th 2022,Harry N. Abrams,Hardcover,Jeff Kinney,217,,No,$14.99,No,978-1-4197-6294-9
Token,Beverly Kendall,Romance,January 3rd 2023,Graydon House,Paperback,N/A,368,,No,$17.99,No,978-1-525-89997-3
Chainsaw Man Vol. 1,Tatsuki Fujimoto,Shonen,October 6th 2020,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,3.0/5,Yes,$9.99,No,978-1-9747-0993-9
Chainsaw Man Vol. 2,Tatsuki Fujimoto,Shonen,December 1st 2020,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,3.5/5,Yes,$9.99,No,978-1-9747-0994-6
Chainsaw Man Vol. 3,Tatsuki Fujimoto,Shonen,February 2nd 2021,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,,No,$9.99,No,978-1-9747-0995-3
Chainsaw Man Vol. 4,Tatsuki Fujimoto,Shonen,April 6th 2021,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,,No,$9.99,No,978-1-9747-2071-2
Chainsaw Man Vol. 5,Tatsuki Fujimoto,Shonen,June 1st 2021,VIZ Media LLC,Paperback,Tatsuki Fujimoto,200,,No,$9.99,No,978-1-9747-1922-8
Chainsaw Man Vol. 6,Tatsuki Fujimoto,Shonen,August 3rd 2021,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,,No,$9.99,No,978-1-9747-1727-9
Chainsaw Man Vol. 7,Tatsuki Fujimoto,Shonen,October 5th 2021,VIZ Media LLC,Paperback,Tatsuki Fujimoto,200,,No,$9.99,No,978-1-9747-2096-5
Chainsaw Man Vol. 8,Tatsuki Fujimoto,Shonen,December 7th 2021,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,,No,$9.99,No,978-1-9747-2278-5
Chainsaw Man Vol. 9,Tatsuki Fujimoto,Shonen,February 1st 2022,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,,No,$9.99,No,978-1-9747-2404-8
Chainsaw Man Vol. 11,Tatsuki Fujimoto,Shonen,June 7th 2022,VIZ Media LLC,Paperback,Tatsuki Fujimoto,192,,No,$9.99,No,978-1-9747-2711-7
Wonder,R.J. Palacio,Fiction,February 14th 2012,Knopf Books for Young Readers,Hardcover,N/A,316,4.0/5,Yes,$16.99,No,978-0-375-86902-0
You Truly Assumed,Laila Sabreen,Young Adult Fiction,February 8th 2022,Inkyard Press,Hardcover,N/A,339,,No,$18.99,No,978-1-335-41865-4
The Heroes of Olympus: The Lost Hero,Rick Riordan,Young Adult/Fantasy,September 24th 2019,Disney-Hyperion,Paperback,N/A,557,3.89/5,Yes,$9.99,10th Anniversary Edition,978-136805143-9
The Heroes of Olympus: The Son of Neptune,Rick Riordan,Young Adult/Fantasy,September 24th 2019,Disney-Hyperion,Paperback,N/A,521,4.85/5,Yes,$9.99,10th Anniversary Edition,978-136805144-6
The Heroes of Olympus: The Mark of Athena,Rick Riordan,Young Adult/Fantasy,September 24th 2019,Disney-Hyperion,Paperback,N/A,584,5.0/5,Yes,$9.99,10th Anniversary Edition,978-136805142-2
The Heroes of Olympus: The House of Hades,Rick Riordan,Young Adult/Fantasy,September 24th 2019,Disney-Hyperion,Paperback,N/A,597,4.95/4,Yes,$9.99,10th Anniversary Edition,978-136805171-2`;
    
    Papa.parse(sampleCSV, {
        header: true,
        complete: function(results) {
            processData(results.data);
            document.getElementById('fileName').textContent = 'Sample Collection Loaded (37 books)';
        }
    });
}

function processData(data) {
    bookData = data.filter(book => book.Title && book.Title.trim() !== '').map(book => {
        // Parse rating
        let rating = null;
        if (book.Rating && book.Rating !== '') {
            const ratingMatch = book.Rating.match(/(\d+\.?\d*)/);
            if (ratingMatch) {
                rating = parseFloat(ratingMatch[1]);
            }
        }
        
        // Parse MSRP
        let msrp = null;
        if (book.MSRP && book.MSRP !== '') {
            const priceMatch = book.MSRP.match(/(\d+\.?\d*)/);
            if (priceMatch) {
                msrp = parseFloat(priceMatch[1]);
            }
        }
        
        return {
            title: book.Title,
            author: book.Author,
            genre: book.Genre,
            publishDate: book['Publish Date'],
            publisher: book.Publisher,
            format: book.Format,
            illustrator: book.Illustrator,
            totalPages: parseInt(book['Total Pages']) || 0,
            rating: rating,
            status: book['Status (Read or Not)'] && book['Status (Read or Not)'].toLowerCase() === 'yes' ? 'Read' : 'Unread',
            msrp: msrp,
            specialEdition: book['Special Edition?'],
            isbn: book.ISBN
        };
    });
    
    if (bookData.length > 0) {
        updateAllViews();
    } else {
        alert('No valid book data found. Please check your file format.');
    }
}

function updateAllViews() {
    updateOverview();
    updateGenreAnalysis();
    updateRatingAnalysis();
    updateSeriesAnalysis();
    updateLibrary();
}

function updateOverview() {
    const stats = calculateOverviewStats();
    
    const statsHTML = `
        <div class="stat-card">
            <div class="stat-label">Total Books</div>
            <div class="stat-value">${stats.totalBooks}</div>
            <div class="stat-subtitle">In your collection</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Books Read</div>
            <div class="stat-value">${stats.booksRead}</div>
            <div class="stat-subtitle">${stats.completionRate}% completion</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Total Pages</div>
            <div class="stat-value">${stats.totalPages.toLocaleString()}</div>
            <div class="stat-subtitle">${stats.pagesRead.toLocaleString()} read</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Average Rating</div>
            <div class="stat-value">${stats.avgRating}</div>
            <div class="stat-subtitle">From ${stats.ratedBooks} rated books</div>
        </div>
    `;
    
    document.getElementById('overviewStats').innerHTML = statsHTML;
    document.getElementById('overviewCharts').style.display = 'block';
    
    updateOverviewCharts(stats);
}

function calculateOverviewStats() {
    const totalBooks = bookData.length;
    const booksRead = bookData.filter(b => b.status === 'Read').length;
    const completionRate = Math.round((booksRead / totalBooks) * 100);
    
    const totalPages = bookData.reduce((sum, b) => sum + b.totalPages, 0);
    const pagesRead = bookData.filter(b => b.status === 'Read').reduce((sum, b) => sum + b.totalPages, 0);
    
    const ratedBooks = bookData.filter(b => b.rating !== null);
    const avgRating = ratedBooks.length > 0 
        ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(2)
        : 'N/A';
    
    return {
        totalBooks,
        booksRead,
        completionRate,
        totalPages,
        pagesRead,
        avgRating,
        ratedBooks: ratedBooks.length
    };
}

function updateOverviewCharts(stats) {
    // Completion Chart
    const ctx1 = document.getElementById('completionChart');
    if (charts.completion) charts.completion.destroy();
    
    charts.completion = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Read', 'Unread'],
            datasets: [{
                data: [stats.booksRead, stats.totalBooks - stats.booksRead],
                backgroundColor: ['#ee7d49', '#8c5be9'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { size: 14 } }
                }
            }
        }
    });
    
    // Format Chart
    const ctx2 = document.getElementById('formatChart');
    if (charts.format) charts.format.destroy();
    
    const formatCounts = {};
    bookData.forEach(book => {
        formatCounts[book.format] = (formatCounts[book.format] || 0) + 1;
    });
    
    charts.format = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: Object.keys(formatCounts),
            datasets: [{
                label: 'Number of Books',
                data: Object.values(formatCounts),
                backgroundColor: '#8c5be9',
                borderColor: '#8c5be9',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    
    // Pages Chart
    const ctx3 = document.getElementById('pagesChart');
    if (charts.pages) charts.pages.destroy();
    
    charts.pages = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: ['Pages Read', 'Pages Unread'],
            datasets: [{
                label: 'Pages',
                data: [stats.pagesRead, stats.totalPages - stats.pagesRead],
                backgroundColor: ['#ee7d49', '#8c5be9'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateGenreAnalysis() {
    if (bookData.length === 0) return;
    
    document.getElementById('genreCharts').style.display = 'block';
    document.getElementById('noGenreData').style.display = 'none';
    
    const filter = document.getElementById('genreStatusFilter')?.value || 'all';
    const filteredData = filter === 'all' ? bookData 
        : bookData.filter(b => b.status === (filter === 'read' ? 'Read' : 'Unread'));
    
    // Genre counts
    const genreCounts = {};
    filteredData.forEach(book => {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });
    
    const ctx1 = document.getElementById('genreCountChart');
    if (charts.genreCount) charts.genreCount.destroy();
    
    const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    charts.genreCount = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: sortedGenres.map(g => g[0]),
            datasets: [{
                label: 'Number of Books',
                data: sortedGenres.map(g => g[1]),
                backgroundColor: '#ee7d49',
                borderColor: '#ee7d49',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true
        }
    });
    
    // Genre ratings
    const genreRatings = {};
    filteredData.forEach(book => {
        if (book.rating !== null) {
            if (!genreRatings[book.genre]) {
                genreRatings[book.genre] = { sum: 0, count: 0 };
            }
            genreRatings[book.genre].sum += book.rating;
            genreRatings[book.genre].count += 1;
        }
    });
    
    const ctx2 = document.getElementById('genreRatingChart');
    if (charts.genreRating) charts.genreRating.destroy();
    
    const genreAvgs = Object.entries(genreRatings)
        .map(([genre, data]) => ({
            genre,
            avg: data.sum / data.count
        }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 10);
    
    charts.genreRating = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: genreAvgs.map(g => g.genre),
            datasets: [{
                label: 'Average Rating',
                data: genreAvgs.map(g => g.avg),
                backgroundColor: '#8c5be9',
                borderColor: '#8c5be9',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: { min: 0, max: 5 }
            }
        }
    });
    
    // Pages by genre
    const genrePages = {};
    filteredData.filter(b => b.status === 'Read').forEach(book => {
        genrePages[book.genre] = (genrePages[book.genre] || 0) + book.totalPages;
    });
    
    const ctx3 = document.getElementById('genrePagesChart');
    if (charts.genrePages) charts.genrePages.destroy();
    
    const sortedPages = Object.entries(genrePages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    charts.genrePages = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: sortedPages.map(g => g[0]),
            datasets: [{
                label: 'Pages Read',
                data: sortedPages.map(g => g[1]),
                backgroundColor: '#ee7d49',
                borderColor: '#ee7d49',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true
        }
    });
}

function updateRatingAnalysis() {
    if (bookData.length === 0) return;
    
    const ratedBooks = bookData.filter(b => b.rating !== null);
    if (ratedBooks.length === 0) {
        document.getElementById('noRatingData').style.display = 'block';
        return;
    }
    
    document.getElementById('ratingCharts').style.display = 'block';
    document.getElementById('noRatingData').style.display = 'none';
    
    // Rating Distribution
    const ctx1 = document.getElementById('ratingDistChart');
    if (charts.ratingDist) charts.ratingDist.destroy();
    
    const ratingBins = { '0-1': 0, '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0 };
    ratedBooks.forEach(book => {
        const bin = Math.floor(book.rating);
        const key = `${bin}-${bin + 1}`;
        if (ratingBins[key] !== undefined) {
            ratingBins[key]++;
        }
    });
    
    charts.ratingDist = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: Object.keys(ratingBins),
            datasets: [{
                label: 'Number of Books',
                data: Object.values(ratingBins),
                backgroundColor: '#ee7d49',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
    
    // Pages vs Rating
    const ctx2 = document.getElementById('pagesVsRatingChart');
    if (charts.pagesVsRating) charts.pagesVsRating.destroy();
    
    charts.pagesVsRating = new Chart(ctx2, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Books',
                data: ratedBooks.map(b => ({ x: b.totalPages, y: b.rating })),
                backgroundColor: '#8c5be9',
                borderColor: '#8c5be9'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Page Count' } },
                y: { title: { display: true, text: 'Rating' }, min: 0, max: 5 }
            }
        }
    });
    
    // Format Ratings
    const ctx3 = document.getElementById('formatRatingChart');
    if (charts.formatRating) charts.formatRating.destroy();
    
    const formatRatings = {};
    ratedBooks.forEach(book => {
        if (!formatRatings[book.format]) {
            formatRatings[book.format] = { sum: 0, count: 0 };
        }
        formatRatings[book.format].sum += book.rating;
        formatRatings[book.format].count += 1;
    });
    
    const formatAvgs = Object.entries(formatRatings)
        .map(([format, data]) => ({
            format,
            avg: data.sum / data.count
        }));
    
    charts.formatRating = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: formatAvgs.map(f => f.format),
            datasets: [{
                label: 'Average Rating',
                data: formatAvgs.map(f => f.avg),
                backgroundColor: '#8c5be9',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: { y: { min: 0, max: 5 } }
        }
    });
    
    // Generate insights
    generateRatingInsights(ratedBooks, formatRatings);
}

function generateRatingInsights(ratedBooks, formatRatings) {
    const insights = [];
    
    // Page count correlation
    const shortBooks = ratedBooks.filter(b => b.totalPages < 300);
    const longBooks = ratedBooks.filter(b => b.totalPages >= 300);
    
    if (shortBooks.length > 0 && longBooks.length > 0) {
        const shortAvg = shortBooks.reduce((sum, b) => sum + b.rating, 0) / shortBooks.length;
        const longAvg = longBooks.reduce((sum, b) => sum + b.rating, 0) / longBooks.length;
        
        insights.push({
            title: ' Page Count Impact',
            text: `${longAvg > shortAvg ? 'Longer' : 'Shorter'} books receive higher ratings on average (${longAvg > shortAvg ? longAvg.toFixed(2) : shortAvg.toFixed(2)} vs ${longAvg > shortAvg ? shortAvg.toFixed(2) : longAvg.toFixed(2)}), suggesting ${longAvg > shortAvg ? 'stronger engagement with immersive stories' : 'preference for concise narratives'}.`
        });
    }
    
    // Format preference
    const graphicNovels = ratedBooks.filter(b => b.format === 'Graphic Novel');
    const otherFormats = ratedBooks.filter(b => b.format !== 'Graphic Novel');
    
    if (graphicNovels.length > 0 && otherFormats.length > 0) {
        const gnAvg = graphicNovels.reduce((sum, b) => sum + b.rating, 0) / graphicNovels.length;
        const otherAvg = otherFormats.reduce((sum, b) => sum + b.rating, 0) / otherFormats.length;
        
        insights.push({
            title: ' Format Preference',
            text: `Graphic novels ${gnAvg > otherAvg ? 'outperform' : 'underperform'} other formats with an average rating of ${gnAvg.toFixed(2)} vs ${otherAvg.toFixed(2)}.`
        });
    }
    
    // Special editions
    const specialEditions = bookData.filter(b => b.specialEdition && b.specialEdition !== 'No');
    const specialRead = specialEditions.filter(b => b.status === 'Read').length;
    const specialUnread = specialEditions.length - specialRead;
    
    if (specialEditions.length > 0) {
        const readRate = (specialRead / specialEditions.length * 100).toFixed(0);
        insights.push({
            title: ' Special Edition Behavior',
            text: `${readRate}% of special editions have been read. ${specialUnread > specialRead ? 'Special editions are more likely to remain unread, suggesting a collector mindset.' : 'You actively read your special editions!'}`
        });
    }
    
    const insightsHTML = insights.map(insight => `
        <div class="insight">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
    
    document.getElementById('ratingInsights').innerHTML = insightsHTML;
}

function updateSeriesAnalysis() {
    if (bookData.length === 0) return;
    
    // Detect series
    const series = detectSeries();
    
    if (Object.keys(series).length === 0) {
        document.getElementById('noSeriesData').style.display = 'block';
        return;
    }
    
    document.getElementById('seriesContainer').style.display = 'block';
    document.getElementById('noSeriesData').style.display = 'none';
    
    const seriesHTML = Object.entries(series).map(([name, books]) => {
        const volumes = books.length;
        const read = books.filter(b => b.status === 'Read').length;
        const completionRate = Math.round((read / volumes) * 100);
        
        const ratedBooks = books.filter(b => b.rating !== null);
        const avgRating = ratedBooks.length > 0
            ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(2)
            : 'N/A';
        
        return `
            <div class="series-card">
                <div class="series-title">${name}</div>
                <div class="series-stats">
                    <div class="series-stat">
                        <span class="series-stat-label">Volumes</span>
                        <span class="series-stat-value">${volumes}</span>
                    </div>
                    <div class="series-stat">
                        <span class="series-stat-label">Completion</span>
                        <span class="series-stat-value">${completionRate}%</span>
                    </div>
                    <div class="series-stat">
                        <span class="series-stat-label">Avg Rating</span>
                        <span class="series-stat-value">${avgRating}</span>
                    </div>
                </div>
                ${ratedBooks.length > 1 ? generateSeriesChart(name, books) : ''}
            </div>
        `;
    }).join('');
    
    document.getElementById('seriesList').innerHTML = seriesHTML;
}

function detectSeries() {
    const series = {};
    
    bookData.forEach(book => {
        // Check for common series patterns
        const patterns = [
            /^(.*?)\s+Vol\.\s*\d+/i,
            /^(.*?)\s+#\d+/i,
            /^(Percy Jackson.*?):.*$/i,
            /^(The Heroes of Olympus):.*$/i,
            /^(Chainsaw Man)/i,
            /^(Grimm):/i
        ];
        
        for (const pattern of patterns) {
            const match = book.title.match(pattern);
            if (match) {
                const seriesName = match[1].trim();
                if (!series[seriesName]) {
                    series[seriesName] = [];
                }
                series[seriesName].push(book);
                break;
            }
        }
    });
    
    // Filter out "series" with only 1 book
    Object.keys(series).forEach(key => {
        if (series[key].length < 2) {
            delete series[key];
        }
    });
    
    return series;
}

function generateSeriesChart(name, books) {
    const canvasId = `series-${name.replace(/\s+/g, '-')}`;
    setTimeout(() => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ratedBooks = books.filter(b => b.rating !== null).sort((a, b) => {
            const aNum = parseInt(a.title.match(/\d+/)?.[0]) || 0;
            const bNum = parseInt(b.title.match(/\d+/)?.[0]) || 0;
            return aNum - bNum;
        });
        
        if (ratedBooks.length < 2) return;
        
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: ratedBooks.map((b, i) => `Vol. ${i + 1}`),
                datasets: [{
                    label: 'Rating',
                    data: ratedBooks.map(b => b.rating),
                    borderColor: '#ee7d49',
                    backgroundColor: 'rgba(139, 38, 53, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { min: 0, max: 5 }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (tooltipItems) {
                                const index = tooltipItems[0].dataIndex;
                                return ratedBooks[index].title;
                            },
                            label: function (tooltipItem) {
                                return `Rating: ${tooltipItem.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });

    }, 100);
    
    return `<canvas id="${canvasId}" style="max-height: 200px; margin-top: 20px;"></canvas>`;
}

function updateLibrary() {
    if (bookData.length === 0) return;
    
    document.getElementById('libraryTable').style.display = 'block';
    document.getElementById('noLibraryData').style.display = 'none';
    
    // Populate filters
    const genres = [...new Set(bookData.map(b => b.genre))].sort();
    const formats = [...new Set(bookData.map(b => b.format))].sort();
    
    const genreFilter = document.getElementById('libraryGenreFilter');
    if (genreFilter.options.length === 1) {
        genreFilter.innerHTML = '<option value="all">All Genres</option>' +
            genres.map(g => `<option value="${g}">${g}</option>`).join('');
    }
    
    const formatFilter = document.getElementById('libraryFormatFilter');
    if (formatFilter.options.length === 1) {
        formatFilter.innerHTML = '<option value="all">All Formats</option>' +
            formats.map(f => `<option value="${f}">${f}</option>`).join('');
    }
    
    // Apply filters
    const genreVal = genreFilter.value;
    const statusVal = document.getElementById('libraryStatusFilter').value;
    const formatVal = formatFilter.value;
    
    let filtered = bookData;
    if (genreVal !== 'all') filtered = filtered.filter(b => b.genre === genreVal);
    if (statusVal !== 'all') filtered = filtered.filter(b => b.status === (statusVal === 'yes' ? 'Read' : 'Unread'));
    if (formatVal !== 'all') filtered = filtered.filter(b => b.format === formatVal);
    
    const tbody = document.getElementById('libraryTableBody');
    tbody.innerHTML = filtered.map(book => `
        <tr>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.format}</td>
            <td>${book.totalPages || 'N/A'}</td>
            <td class="${book.rating >= 4.5 ? 'high-rating' : ''}">${book.rating ? book.rating.toFixed(2) : 'N/A'}</td>
            <td><span class="${book.status === 'Read' ? 'read-badge' : 'unread-badge'}">${book.status}</span></td>
        </tr>
    `).join('');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}
