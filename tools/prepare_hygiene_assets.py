#!/usr/bin/env python3
"""Generează exclusiv fișiere media individuale pentru activitățile de igienă."""
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

root = Path(__file__).resolve().parents[1]
media = root / "assets" / "hygiene"
out = media / "individual"
out.mkdir(parents=True, exist_ok=True)
sprite = np.asarray(Image.open(media / "hygiene-3d-sprite.webp").convert("RGBA"))
regions = [(0,250), (257,490), (492,669), (678,897)]
kinds = ["basket","soap","brush","towel"]
colors = ["red","yellow","blue"]
for row, (top,bottom) in enumerate(regions):
    for col,color in enumerate(colors):
        image = sprite[top:bottom,col*300:(col+1)*300].copy()
        alpha = image[:,:,3]
        mask = (alpha>45).astype("uint8")
        size = (7,7) if row == 2 else (11,11)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,size)
        opened = cv2.morphologyEx(mask,cv2.MORPH_OPEN,kernel)
        n, labels, stats, centers = cv2.connectedComponentsWithStats(opened, connectivity=8)
        comps = sorted(range(1,n),key=lambda i:stats[i,cv2.CC_STAT_AREA],reverse=True)
        if not comps:
            raise RuntimeError("Could not segment "+kinds[row]+" "+color)
        main = np.zeros_like(mask)
        for idx in comps:
            if stats[idx,cv2.CC_STAT_AREA]>max(90,stats[comps[0],cv2.CC_STAT_AREA]*.06):
                main[labels==idx]=1
        main = cv2.dilate(main,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(13,13)))
        image[:,:,3] = np.minimum(alpha,cv2.GaussianBlur(main.astype(np.float32),(7,7),0)*255).astype("uint8")
        ys,xs=np.where(image[:,:,3]>20)
        if len(xs):
            image=image[max(0,ys.min()-3):min(image.shape[0],ys.max()+5),max(0,xs.min()-3):min(image.shape[1],xs.max()+5)]
        item=Image.fromarray(image)
        item.thumbnail((325,260),Image.Resampling.LANCZOS)
        canvas=Image.new("RGBA",(360,300),(0,0,0,0))
        canvas.alpha_composite(item,((360-item.width)//2,(300-item.height)//2))
        dest=out/(kinds[row]+"-"+color+".webp")
        canvas.save(dest,"WEBP",lossless=True,method=6)
        print("Wrote",dest.relative_to(root),dest.stat().st_size)

# White dental enamel in the cleaned layer only. Keep lips, gums, tongue and brush unchanged.
photo = Image.open(media/"teeth-3d-clean.webp").convert("RGB")
w,h = photo.size
if (w,h)!=(1152,864):
    raise RuntimeError("Unexpected tooth-photo dimensions")
polygons = [
[(236,238),(250,218),(275,200),(310,190),(349,198),(376,228),(387,272),(377,337),(345,349),(277,343),(238,318),(227,277)],
[(385,225),(402,198),(432,185),(474,181),(517,191),(547,214),(566,262),(560,334),(539,353),(475,357),(417,341),(389,310)],
[(563,222),(592,192),(639,182),(684,187),(725,211),(739,250),(734,331),(713,353),(648,355),(596,341),(566,301)],
[(740,220),(762,197),(803,192),(838,201),(868,231),(873,274),(858,330),(827,344),(774,340),(740,298)],
[(240,478),(267,458),(315,464),(356,487),(383,526),(373,585),(345,612),(294,614),(254,583),(237,536)],
[(378,503),(411,486),(469,486),(530,492),(555,516),(551,595),(528,638),(493,652),(425,644),(390,610),(376,553)],
[(546,508),(587,490),(638,488),(697,493),(729,519),(731,590),(707,631),(670,650),(607,641),(564,613)],
[(726,493),(760,474),(800,460),(830,480),(853,509),(852,562),(827,595),(785,611),(739,580),(723,540)]
]
mask=Image.new("L",(w,h),0)
drawer=ImageDraw.Draw(mask)
for points in polygons: drawer.polygon(points,fill=255)
original=np.asarray(photo).astype(np.float32)
lum=original[:,:,0]*.21+original[:,:,1]*.67+original[:,:,2]*.12
# The natural gum is pink and has lower green/blue channels.
green=original[:,:,1]
blue=original[:,:,2]
allow=np.clip((green-125)/20,0,1)*np.clip((blue-113)/20,0,1)*np.clip((green-original[:,:,0]*.58)/24,0,1)
maskarr=np.asarray(mask).astype(np.float32)/255*allow
m=Image.fromarray(np.uint8(maskarr*255),"L").filter(ImageFilter.GaussianBlur(1.5))
alpha=np.asarray(m).astype(np.float32)/255
shine=np.clip(242+(lum-160)*.15,239,255)
white=np.stack([shine,np.minimum(255,shine+1),np.minimum(255,shine+4)],axis=-1)
final=np.uint8(np.clip(original*(1-alpha[:,:,None])+white*alpha[:,:,None],0,255))
dest=media/"teeth-3d-white.webp"
Image.fromarray(final).save(dest,"WEBP",quality=96,method=6)
print("Wrote",dest.relative_to(root),dest.stat().st_size)
