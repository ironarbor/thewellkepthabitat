export function EditorialCover() {
  return (
    <div className="editorial-cover" aria-label="Concept cover for the Spring 2027 editorial">
      <div className="cover-masthead">
        <div className="cover-date">Spring 2027<br />Volume 1 · Issue 1</div>
        <span>The Well-Kept Habitat</span>
        <div className="cover-rule"><i /></div>
        <strong>Local Landscape Editorial</strong>
      </div>
      <div className="cover-image">
        <img src="/images/twkh-garden-hero.jpg" alt="An ecological garden in warm late-summer light" />
        <div className="cover-stories">
          <div><h3>Rooted in Place</h3><p>Designing ecological gardens that thrive in Longmeadow</p></div>
          <div><h3>Native Beauty</h3><p>The sophisticated elegance of native plants in every season</p></div>
          <div><h3>Local Gardens</h3><p>Inspiration from Longmeadow home landscapes</p></div>
          <div><h3>Seasonal Guide</h3><p>Planting for pollinators, wildlife and beauty</p></div>
        </div>
      </div>
      <div className="cover-footer"><span className="mini-seal">TWKH</span><p>A quarterly publication for Longmeadow homeowners</p></div>
    </div>
  );
}
